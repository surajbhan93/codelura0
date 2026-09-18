import GbpCompetitor from "../../models/gbp/GbpCompetitor.js";
import GbpLocation from "../../models/gbp/GbpLocation.js";
import { discoverLocalCompetitors, generateCompetitorComparisonInsights } from "../../services/gbp/gbpGrokAI.service.js";

const computeRankAndAnalysis = async (loc, competitors) => {
  const myRating = loc?.averageRating || 4.5;
  const myReviews = loc?.reviewCount || 0;
  const myName = loc?.locationName || "My Business Profile";

  const userEntry = {
    isUser: true,
    _id: "user_gbp",
    businessName: `${myName} (Your GBP)`,
    rating: myRating,
    reviewCount: myReviews,
    category: loc?.primaryCategory?.displayName || "Primary Category",
    address: loc?.address?.addressLines?.join(", ") || loc?.address?.locality || "Your Address",
    phone: loc?.primaryPhone || "Your Phone",
    website: loc?.websiteUri || "Your Website",
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(myName + " " + (loc?.address?.locality || ""))}`,
    notes: "📍 Your Active Google Business Profile",
  };

  const combined = [
    userEntry,
    ...competitors.map(c => {
      const obj = c.toObject ? c.toObject() : c;
      return {
        ...obj,
        mapsUrl: obj.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((obj.businessName || "") + " " + (obj.address || ""))}`,
        isUser: false
      };
    }),
  ];

  combined.sort((a, b) => {
    if ((b.rating || 0) !== (a.rating || 0)) {
      return (b.rating || 0) - (a.rating || 0);
    }
    return (b.reviewCount || 0) - (a.reviewCount || 0);
  });

  const myRankIndex = combined.findIndex(item => item.isUser);
  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : 1;

  const insights = await generateCompetitorComparisonInsights({
    myBusiness: { locationName: myName, averageRating: myRating, reviewCount: myReviews },
    competitors,
  });

  return {
    competitors: combined,
    myRank,
    totalCompetitors: combined.length,
    insights,
    myLocation: {
      locationName: myName,
      averageRating: myRating,
      reviewCount: myReviews,
      phone: loc?.primaryPhone,
      website: loc?.websiteUri,
      address: loc?.address?.locality,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(myName + " " + (loc?.address?.locality || ""))}`,
      rank: myRank,
    },
  };
};

export const listCompetitors = async (req, res) => {
  try {
    const { locationId } = req.params;
    const loc = await GbpLocation.findOne({ _id: locationId, userId: req.user._id });
    const competitors = await GbpCompetitor.find({ userId: req.user._id, locationId });
    
    const analysis = await computeRankAndAnalysis(loc, competitors);
    res.json({ success: true, data: competitors, ...analysis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const autoDiscoverCompetitorsController = async (req, res) => {
  try {
    const { locationId } = req.params;
    const loc = await GbpLocation.findOne({ _id: locationId, userId: req.user._id });
    if (!loc) return res.status(404).json({ success: false, message: "Location not found." });

    const businessName = loc.locationName || "";
    let category = loc.primaryCategory?.displayName || loc.primaryCategory?.categoryId || "";

    // Infer category from location name if missing or generic
    const lowerBName = businessName.toLowerCase();
    if (!category || category.toLowerCase() === "primary category") {
      if (lowerBName.includes("home tuition") || lowerBName.includes("tutor") || lowerBName.includes("tuition")) {
        category = "Home Tuition Provider / Private Tutor";
      } else if (lowerBName.includes("website") || lowerBName.includes("software") || lowerBName.includes("development") || lowerBName.includes("codelura") || lowerBName.includes("technologies")) {
        category = "Website Development & Software Solutions";
      } else if (lowerBName.includes("wine") || lowerBName.includes("beer") || lowerBName.includes("liquor")) {
        category = "Wine & Beer Shop";
      } else if (lowerBName.includes("coaching") || lowerBName.includes("academy") || lowerBName.includes("classes")) {
        category = "Coaching Institute";
      }
    }
    
    // Priority: req.body.city > req.query.city > loc.address.locality > addressLines string match > default "Prayagraj"
    const requestedCity = req.body?.city || req.query?.city;
    let extractedCity = loc.address?.locality || loc.address?.administrativeArea;
    if (!extractedCity && loc.address?.addressLines?.length) {
      const fullAddr = loc.address.addressLines.join(" ");
      if (fullAddr.toLowerCase().includes("prayagraj") || fullAddr.toLowerCase().includes("allahabad")) extractedCity = "Prayagraj";
      else if (fullAddr.toLowerCase().includes("noida")) extractedCity = "Noida";
      else if (fullAddr.toLowerCase().includes("lucknow")) extractedCity = "Lucknow";
      else if (fullAddr.toLowerCase().includes("delhi")) extractedCity = "Delhi";
      else extractedCity = fullAddr.split(",").pop()?.trim() || "Prayagraj";
    }

    const city = requestedCity || extractedCity || "Prayagraj";
    const address = loc.address?.addressLines?.join(", ");

    // Delete existing auto-discovered competitors to replace with fresh city-specific scan
    await GbpCompetitor.deleteMany({ userId: req.user._id, locationId });

    const discovered = await discoverLocalCompetitors({ businessName, category, city, address });

    const savedCompetitors = [];
    for (const comp of discovered) {
      if (!comp.businessName || comp.businessName === businessName) continue;
      const doc = await GbpCompetitor.create({
        userId: req.user._id,
        locationId,
        businessName: comp.businessName,
        phone: comp.phone || "",
        address: comp.address || `${city}`,
        website: comp.website || "",
        mapsUrl: comp.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((comp.businessName || "") + " " + (comp.address || city || ""))}`,
        rating: comp.rating || 4.5,
        reviewCount: comp.reviewCount || 50,
        category: comp.category || category || "Competitor",
        notes: comp.notes || `Top Competitor in ${city}`,
      });
      savedCompetitors.push(doc);
    }

    const allCompetitors = await GbpCompetitor.find({ userId: req.user._id, locationId });
    const analysis = await computeRankAndAnalysis(loc, allCompetitors);
    
    res.json({
      success: true,
      data: allCompetitors,
      targetCity: city,
      ...analysis,
      message: `Discovered ${savedCompetitors.length} competitors in ${city}.`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addCompetitor = async (req, res) => {
  try {
    const competitor = await GbpCompetitor.create({ userId: req.user._id, locationId: req.params.locationId, ...req.body });
    res.status(201).json({ success: true, data: competitor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCompetitor = async (req, res) => {
  try {
    const competitor = await GbpCompetitor.findOneAndUpdate(
      { _id: req.params.competitorId, userId: req.user._id, locationId: req.params.locationId },
      { ...req.body, lastUpdatedManually: new Date() },
      { new: true }
    );
    if (!competitor) return res.status(404).json({ success: false, message: "Competitor not found." });
    res.json({ success: true, data: competitor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCompetitor = async (req, res) => {
  try {
    await GbpCompetitor.findOneAndDelete({ _id: req.params.competitorId, userId: req.user._id });
    res.json({ success: true, message: "Competitor removed." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

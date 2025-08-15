import express from "express";
const router = express.Router();

const KEY = process.env.GMAPS_KEY;

router.get("/gyms/:lat/:lng/:radius", async (req, res) => {
  const { lat, lng, radius } = req.params;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=gym&key=${process.env.GMAPS_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  res.send(data);
});

export default router;

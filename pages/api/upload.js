import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: "dl3mpo0w3",
  api_key: "999524251147143",
  api_secret: "7sAgeZ-rvasuHhbIZfYghdjqBqI",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { image } = req.body;

      // Upload image to Cloudinary
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "web-camera-photos", // Optional: Organize images in a folder
      });

      // Return the Cloudinary URL
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

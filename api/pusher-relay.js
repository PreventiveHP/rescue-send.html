 const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "2136238",
  key: "284fc98940a4b6d4c359",
  secret: "12350b4e5f5a0b796bb3",
  cluster: "us2",
  useTLS: true
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extraemos channel_id (el ID único) y location (GPS) del cuerpo de la petición
    const { sys, dia, patient, provider, channel_id, location } = req.body;

    try {
        // Determinamos el nombre del canal. 
        // Si por alguna razón no viene el ID, usamos el genérico por seguridad.
        const targetChannel = channel_id ? `rescue-${channel_id}` : "montcode-rescue";

        await pusher.trigger(targetChannel, "new-reading", {
            sys, 
            dia, 
            patient, 
            provider,
            location: location || "No GPS Data"
        });

        res.status(200).json({ 
            sent: true, 
            channel: targetChannel 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

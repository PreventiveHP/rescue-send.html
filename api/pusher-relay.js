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
    const { sys, dia, patient, provider } = req.body;
    try {
        await pusher.trigger("montcode-rescue", "new-reading", {
            sys, dia, patient, provider
        });
        res.status(200).json({ sent: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

🟧 BTC.ID Identity App
Welcome to the BTC.ID Identity App - a modern, interactive demo for creating, verifying, and managing decentralized Bitcoin-based identities using Zero-Knowledge Proofs, Sismo, Zupass, and Bitcoin Ordinals.
Easily generate ZK proofs, connect to group attestations, inscribe proofs on Bitcoin, and export W3C-compliant DID documents - all from a sleek React interface!

🚀 Features
🔐 Create BTC.ID Identity
Enter your Bitcoin address, secret, and public key to generate a Zero-Knowledge Proof of your identity.

✅ Verify ZK Proof
Instantly check the validity of your generated proof.

🪪 Attestations

Sismo Groups: Connect and verify memberships (Ethereum Power Users, ENS Holders, Lens Profiles, and more).

Zupass: Retrieve and verify event tickets.

Custom Attestations: Add your own attestations with type and description.

🟠 Bitcoin Ordinals Inscription
Inscribe your proof directly on the Bitcoin blockchain for immutable verification.

📄 DID Document Export
Export a W3C-compliant Decentralized Identifier (DID) document based on your Bitcoin address and public key.

🛠️ Technologies & Languages Used
JavaScript (ES6+) - Application logic and React components

React - UI framework (functional components & hooks)

JSX - React templating syntax

Tailwind CSS (inferred from class names) - Utility-first CSS styling

Lucide-react - Modern SVG icon library

📂 Project Structure
text
btc-id-app/
│
├── App.js           # Main React component
├── README.md        # This file
├── package.json     # Project metadata & dependencies
└── ...              # Other React app files
▶️ Getting Started
Clone the repository

bash
git clone <your-repo-url>
cd btc-id-app
Install dependencies

bash
npm install
Start the development server

bash
npm start

✨ Code Highlights
Service Classes

ZKProofService - Simulates ZK proof generation & verification

SismoService - Simulates group attestation connections

ZupassService - Simulates event ticket retrieval

OrdinalsService - Simulates Bitcoin Ordinals inscription

DIDService - Generates DID documents

Main Component (BtcIdApp)
Handles UI logic, state, and user interactions for all features.

Custom Attestation Form
Easily add your own attestations to your identity profile.

⚠️ Notes
Mock Implementations
All backend services are mocked for demonstration. No real blockchain or ZK operations are performed.

Security
Never use real private keys or sensitive information in this demo app.

Customization
Extend the service classes to integrate real APIs or blockchain interactions as needed.

📜 License
MIT License

🙋‍♂️ Need Help or Want to Contribute?
Open an issue or submit a pull request!
For questions or feature requests, feel free to reach out.

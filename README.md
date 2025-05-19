BTC.ID Identity App
A React-based demo application for creating, verifying, and managing Bitcoin-based decentralized identities (DIDs) using Zero-Knowledge Proofs, Sismo, Zupass, and Bitcoin Ordinals. The app provides a user-friendly interface for generating ZK proofs, connecting to group attestations, inscribing proofs on Bitcoin via ordinals, and exporting DID documents.

Features
Create BTC.ID Identity:
Enter your Bitcoin address, secret (private key or passphrase), and public key to generate a Zero-Knowledge Proof of identity.

Verify ZK Proof:
Verify the generated proof to ensure its validity.

Attestations:

Sismo Groups: Connect and verify group memberships (e.g., Ethereum Power Users, ENS Holders, Lens Profiles).

Zupass: Retrieve and verify event tickets.

Custom Attestations: Add your own attestations with type and description.

Bitcoin Ordinals Inscription:
Inscribe your proof on the Bitcoin blockchain for immutable verification.

DID Document Export:
Generate and export a W3C-compliant Decentralized Identifier (DID) document based on your Bitcoin address and public key.

Technologies & Languages Used
JavaScript (ES6+):
The entire application logic, including service classes and React components, is written in JavaScript.

React:
Utilizes React functional components and hooks (useState, useEffect, useCallback) for UI and state management.

Lucide-react:
Icon library for React, providing modern SVG icons.

Tailwind CSS (assumed from class names):
Utility-first CSS framework for styling components.

File Structure Overview
text
btc-id-app/
│
├── App.js (main code as provided)
├── README.md (this file)
├── package.json
└── ... (other React app files)
How to Run
Clone the repository (or copy the code into a new React project):

bash
git clone <your-repo-url>
cd btc-id-app
Install dependencies:

bash
npm install
Start the development server:

bash
npm start
The app will be available at http://localhost:3000.

Code Highlights
Service Classes:

ZKProofService: Simulates ZK proof generation and verification.

SismoService: Simulates group attestation connections.

ZupassService: Simulates event ticket retrieval.

OrdinalsService: Simulates inscription on Bitcoin Ordinals.

DIDService: Generates DID documents.

Main Component (BtcIdApp):
Handles all UI logic, state, and user interactions for proof generation, verification, attestations, inscriptions, and DID export.

Custom Attestation Form:
Allows users to add their own attestations to their identity profile.

Notes
Mock Implementations:
All backend services are mocked for demonstration purposes (no real blockchain or ZK operations).

Security:
Never use real private keys or sensitive information in this demo app.

Customization:
You can extend the service classes to integrate real APIs or blockchain interactions as needed.

License
MIT License

If you need further customization or want a markdown version of this README, let me know!
Summary of Languages/Technologies:

JavaScript (React)

JSX (React syntax)

Tailwind CSS (for styling, inferred from class names)

Lucide-react (icon library)

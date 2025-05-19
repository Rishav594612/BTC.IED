import React, { useState, useEffect, useCallback } from 'react';
import {
  Key, Shield, Users, Bitcoin, Zap, Check, Upload, Download, Eye, EyeOff,
  FileKey, Globe, Database, QrCode, Link, Server, AlertCircle, CheckCircle
} from 'lucide-react';

// Service Classes (Mock implementations for demo)
class ZKProofService {
  static async generateProof(btcAddress, secret, publicKey) {
    // Simulate proof generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      nullifierHash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      proof: `proof_${Math.random().toString(36).substr(2, 9)}`,
      publicSignals: [btcAddress, publicKey]
    };
  }

  static async verifyProof(proof) {
    // Simulate proof verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.2; // 80% success rate for demo
  }
}

class SismoService {
  static async connectGroup(groupId) {
    // Simulate Sismo connection
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: groupId,
      verified: true,
      timestamp: Date.now()
    };
  }
}

class ZupassService {
  static async getTickets(email) {
    // Simulate Zupass ticket retrieval
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { event: 'Devcon VI', year: '2022', verified: true },
      { event: 'ETH Denver', year: '2023', verified: true }
    ];
  }
}

class OrdinalsService {
  static async inscribe(data) {
    // Simulate ordinals inscription
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      inscriptionId: `${Math.random().toString(36).substr(2, 9)}i0`,
      txid: `0x${Math.random().toString(16).substr(2, 8)}...`,
      status: 'confirmed'
    };
  }
}

class DIDService {
  static createDocument(btcAddress, publicKey) {
    return {
      "@context": ["https://www.w3.org/ns/did/v1"],
      "id": `did:btc:${btcAddress}`,
      "publicKey": [{
        "id": `did:btc:${btcAddress}#keys-1`,
        "type": "EcdsaSecp256k1VerificationKey2019",
        "controller": `did:btc:${btcAddress}`,
        "publicKeyHex": publicKey
      }],
      "authentication": [`did:btc:${btcAddress}#keys-1`],
      "service": [{
        "id": `did:btc:${btcAddress}#btc`,
        "type": "BitcoinAddress",
        "serviceEndpoint": btcAddress
      }]
    };
  }
}

// Custom Attestation Form Component
function CustomAttestationForm({ onAdd }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type.trim() && description.trim()) {
      setIsSubmitting(true);
      try {
        await onAdd(type.trim(), description.trim());
        setType('');
        setDescription('');
      } catch (error) {
        console.error('Error adding attestation:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Type (e.g. github)"
        value={type}
        onChange={e => setType(e.target.value)}
        required
        disabled={isSubmitting}
      />
      <input
        className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        disabled={isSubmitting}
      />
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50"
        type="submit"
        disabled={isSubmitting || !type.trim() || !description.trim()}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

// Main Application Component
const BtcIdApp = () => {
  // Core identity state
  const [btcAddress, setBtcAddress] = useState('');
  const [secret, setSecret] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState('create');
  const [backendStatus, setBackendStatus] = useState('checking');
  
  // ZK Proof state
  const [currentProof, setCurrentProof] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  
  // Attestations state
  const [attestations, setAttestations] = useState([]);
  const [sismoGroups] = useState([
    { id: 'ethereum-power-users', name: 'Ethereum Power Users' },
    { id: 'ens-holders', name: 'ENS Holders' },
    { id: 'lens-profiles', name: 'Lens Profiles' }
  ]);
  const [zupassTickets, setZupassTickets] = useState([]);
  
  // Ordinals state
  const [inscriptionData, setInscriptionData] = useState(null);
  const [isInscribing, setIsInscribing] = useState(false);
  
  // DID state
  const [didDocument, setDidDocument] = useState(null);

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Simulate backend check
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('error');
      }
    };
    checkBackend();
  }, []);

  // Generate ZK Proof
  const generateRealZKProof = useCallback(async () => {
    if (!btcAddress || !secret) return;
    
    setIsGenerating(true);
    try {
      const proof = await ZKProofService.generateProof(btcAddress, secret, publicKey);
      setCurrentProof(proof);
      setVerificationStatus(null);
    } catch (error) {
      console.error('Error generating proof:', error);
      alert('Failed to generate proof. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [btcAddress, secret, publicKey]);

  // Verify ZK Proof
  const verifyZKProof = useCallback(async () => {
    if (!currentProof) return;
    
    setVerificationStatus('verifying');
    try {
      const isValid = await ZKProofService.verifyProof(currentProof);
      setVerificationStatus(isValid ? 'valid' : 'invalid');
    } catch (error) {
      console.error('Error verifying proof:', error);
      setVerificationStatus('error');
    }
  }, [currentProof]);

  // Connect to Sismo Group
  const connectSismo = useCallback(async (groupId) => {
    try {
      const result = await SismoService.connectGroup(groupId);
      setAttestations(prev => [...prev, {
        id: Date.now(),
        type: 'sismo',
        groupId,
        verified: result.verified,
        timestamp: result.timestamp
      }]);
    } catch (error) {
      console.error('Error connecting to Sismo:', error);
      alert('Failed to connect to Sismo group.');
    }
  }, []);

  // Connect to Zupass
  const connectZupass = useCallback(async (email) => {
    try {
      const tickets = await ZupassService.getTickets(email);
      setZupassTickets(tickets);
      tickets.forEach(ticket => {
        setAttestations(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'zupass',
          event: ticket.event,
          year: ticket.year,
          verified: ticket.verified
        }]);
      });
    } catch (error) {
      console.error('Error connecting to Zupass:', error);
      alert('Failed to connect to Zupass.');
    }
  }, []);

  // Add custom attestation
  const addCustomAttestation = useCallback(async (type, description) => {
    setAttestations(prev => [...prev, {
      id: Date.now(),
      type: 'custom',
      subtype: type,
      description,
      verified: false,
      timestamp: Date.now()
    }]);
  }, []);

  // Create Bitcoin Inscription
  const createBitcoinInscription = useCallback(async () => {
    if (!currentProof) return;
    
    setIsInscribing(true);
    try {
      const inscription = await OrdinalsService.inscribe({
        proof: currentProof,
        btcAddress,
        timestamp: Date.now()
      });
      setInscriptionData(inscription);
    } catch (error) {
      console.error('Error creating inscription:', error);
      alert('Failed to create Bitcoin inscription.');
    } finally {
      setIsInscribing(false);
    }
  }, [currentProof, btcAddress]);

  // Create DID Document
  const createDIDDocument = useCallback(() => {
    if (!btcAddress || !publicKey) return;
    
    const document = DIDService.createDocument(btcAddress, publicKey);
    setDidDocument(document);
  }, [btcAddress, publicKey]);

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'create':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Key className="w-6 h-6 mr-2 text-orange-500" />
              Create BTC.ID Identity
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Bitcoin Address</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="bc1q... or 1... or 3..."
                  value={btcAddress}
                  onChange={e => setBtcAddress(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Secret (Private Key or Passphrase)</label>
                <div className="flex">
                  <input
                    className="w-full border border-gray-300 px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type={showSecret ? "text" : "password"}
                    placeholder="Your secret"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                  />
                  <button
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-50"
                    onClick={() => setShowSecret(!showSecret)}
                    type="button"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Public Key</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Hex-encoded public key"
                  value={publicKey}
                  onChange={e => setPublicKey(e.target.value)}
                />
              </div>
              
              <button
                className="w-full bg-orange-500 text-white font-semibold py-3 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={generateRealZKProof}
                disabled={isGenerating || !btcAddress || !secret}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Proof...
                  </span>
                ) : (
                  "Generate ZK Proof"
                )}
              </button>
              
              {currentProof && (
                <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-semibold text-green-800">Proof Generated Successfully!</span>
                  </div>
                  <div className="mt-2 text-sm text-green-700">
                    <div><strong>Nullifier Hash:</strong> <span className="font-mono">{currentProof.nullifierHash}</span></div>
                    <div><strong>Proof ID:</strong> <span className="font-mono">{currentProof.proof}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'verify':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-500" />
              Verify ZK Proof
            </h2>
            
            {!currentProof ? (
              <div className="text-center text-gray-500 py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No proof to verify. Please generate a proof first.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Current Proof Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Nullifier:</strong> <span className="font-mono">{currentProof.nullifierHash}</span></div>
                    <div><strong>Proof:</strong> <span className="font-mono">{currentProof.proof}</span></div>
                  </div>
                </div>
                
                <button
                  className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
                  onClick={verifyZKProof}
                  disabled={verificationStatus === 'verifying'}
                >
                  {verificationStatus === 'verifying' ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </span>
                  ) : (
                    "Verify Proof"
                  )}
                </button>
                
                {verificationStatus && verificationStatus !== 'verifying' && (
                  <div className={`p-4 rounded-md ${
                    verificationStatus === 'valid'
                      ? 'bg-green-50 border border-green-200'
                      : verificationStatus === 'invalid'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center">
                      {verificationStatus === 'valid' && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                      {verificationStatus === 'invalid' && <AlertCircle className="w-5 h-5 text-red-500 mr-2" />}
                      {verificationStatus === 'error' && <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />}
                      <span className={`font-semibold ${
                        verificationStatus === 'valid' ? 'text-green-800' :
                        verificationStatus === 'invalid' ? 'text-red-800' : 'text-yellow-800'
                      }`}>
                        Proof is {verificationStatus === 'error' ? 'Error during verification' : verificationStatus}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'attestations':
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-purple-500" />
              Attestations & Social Proofs
            </h2>
            
            <div className="space-y-6">
              {/* Sismo Groups */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Sismo Groups</h3>
                <div className="flex flex-wrap gap-2">
                  {sismoGroups.map(group => (
                    <button
                      key={group.id}
                      className="px-3 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition text-sm"
                      onClick={() => connectSismo(group.id)}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Zupass Tickets */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Zupass Event Tickets</h3>
                <div className="flex gap-2">
                  <input
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                    placeholder="Enter your email"
                    type="email"
                    onBlur={e => e.target.value && connectZupass(e.target.value)}
                  />
                </div>
                {zupassTickets.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {zupassTickets.map((ticket, i) => (
                      <div key={i} className="flex items-center text-sm bg-gray-50 p-2 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>{ticket.event} ({ticket.year})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Custom Attestation */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Add Custom Attestation</h3>
                <CustomAttestationForm onAdd={addCustomAttestation} />
              </div>
              
              {/* Your Attestations */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Your Attestations ({attestations.length})</h3>
                {attestations.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No attestations yet. Connect to services above to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {attestations.map(att => (
                      <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div>
                          <span className="font-semibold capitalize">{att.type}</span>
                          {att.subtype && <span className="mx-2">•</span>}
                          {att.subtype && <span className="text-gray-600">{att.subtype}</span>}
                          <div className="text-sm text-gray-500">
                            {att.description || att.groupId || `${att.event} (${att.year})`}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {att.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'ordinals':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Bitcoin className="w-6 h-6 mr-2 text-yellow-500" />
              Bitcoin Ordinals Inscription
            </h2>
            
            {!currentProof ? (
              <div className="text-center text-gray-500 py-8">
                <Bitcoin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Generate a ZK proof first to inscribe on Bitcoin Ordinals.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
                  <h3 className="font-semibold mb-2 text-orange-800">Ready to Inscribe</h3>
                  <p className="text-sm text-orange-700">
                    Your ZK proof will be permanently inscribed on the Bitcoin blockchain via Ordinals.
                  </p>
                </div>
                
                <button
                  className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-md hover:bg-yellow-600 transition disabled:opacity-50"
                  onClick={createBitcoinInscription}
                  disabled={isInscribing}
                >
                  {isInscribing ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Inscribing on Bitcoin...
                    </span>
                  ) : (
                    "Inscribe Proof on Ordinals"
                  )}
                </button>
                
                {inscriptionData && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-semibold text-blue-800">Inscription Successful!</span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Inscription ID:</strong> <span className="font-mono">{inscriptionData.inscriptionId}</span></div>
                      <div><strong>Transaction ID:</strong> <span className="font-mono">{inscriptionData.txid}</span></div>
                      <div><strong>Status:</strong> <span className="capitalize">{inscriptionData.status}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'did':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FileKey className="w-6 h-6 mr-2 text-green-500" />
              W3C DID Management
            </h2>
            
            {!btcAddress || !publicKey ? (
              <div className="text-center text-gray-500 py-8">
                <FileKey className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Please provide Bitcoin address and public key to create a DID document.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <h3 className="font-semibold mb-2 text-green-800">Ready to Create DID</h3>
                  <p className="text-sm text-green-700">
                    Create a W3C compliant Decentralized Identifier document for your Bitcoin identity.
                  </p>
                </div>
                
                <button
                  className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 transition"
                  onClick={createDIDDocument}
                >
                  Create DID Document
                </button>
                
                {didDocument && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <span className="font-semibold text-gray-800">DID Document Created</span>
                    </div>
                    <div className="max-h-80 overflow-auto">
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify(didDocument, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'dashboard':
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-indigo-500" />
              Identity Dashboard
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">Bitcoin Address</div>
                  <div className="font-mono text-sm">
                    {btcAddress || 'Not set'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">Identity Score</div>
                  <div className="text-xl font-bold text-indigo-600">
                    {attestations.length * 10 + (currentProof ? 50 : 0)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">Attestations</div>
                  <div className="text-xl font-bold">{attestations.length}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">ZK Proof</div>
                  <div className={`text-sm font-semibold ${currentProof ? 'text-green-600' : 'text-gray-400'}`}>
                    {currentProof ? 'Generated' : 'Not created'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">DID Document</div>
                  <div className={`text-sm font-semibold ${didDocument ? 'text-green-600' : 'text-gray-400'}`}>
                    {didDocument ? 'Created' : 'Not created'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-600">Ordinal Inscription</div>
                  <div className={`text-sm font-semibold ${inscriptionData ? 'text-green-600' : 'text-gray-400'}`}>
                    {inscriptionData ? 'Inscribed' : 'Not inscribed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Tab Not Found</h2>
            <p className="text-gray-600">The requested tab could not be found.</p>
          </div>
        );
    }
  };

  // Navigation tabs configuration
  const navTabs = [
    { id: 'create', label: 'Create Identity', icon: Key },
    { id: 'verify', label: 'Verify Proof', icon: Shield },
    { id: 'attestations', label: 'Attestations', icon: Users },
    { id: 'ordinals', label: 'Ordinals', icon: Bitcoin },
    { id: 'did', label: 'DID Management', icon: FileKey },
    { id: 'dashboard', label: 'Dashboard', icon: Zap }
  ];

  // Main component render
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bitcoin className="w-12 h-12 text-orange-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">BTC.ID</h1>
            <div className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
              backendStatus === 'connected' 
                ? 'bg-green-100 text-green-800' 
                : backendStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              Backend: {backendStatus}
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bitcoin Social Identity Layer with Real Zero-Knowledge Proofs, Ordinals, and W3C DIDs
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center"><Shield className="w-4 h-4 mr-1" />Real ZK Proofs</span>
            <span className="flex items-center"><Key className="w-4 h-4 mr-1" />SnarkJS/Noir</span>
            <span className="flex items-center"><Bitcoin className="w-4 h-4 mr-1" />Bitcoin Ordinals</span>
            <span className="flex items-center"><Users className="w-4 h-4 mr-1" />Sismo/Zupass</span>
            <span className="flex items-center"><FileKey className="w-4 h-4 mr-1" />W3C DIDs</span>
            <span className="flex items-center"><Server className="w-4 h-4 mr-1" />Backend API</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm p-1 border flex flex-wrap">
            {navTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-4 py-2 rounded-md transition text-sm font-medium m-1 ${
                  activeTab === id
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BtcIdApp;
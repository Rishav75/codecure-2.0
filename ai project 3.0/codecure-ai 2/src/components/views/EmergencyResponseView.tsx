import React, { useState, useEffect } from 'react';
import {
  Siren,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  UserCheck,
  Building2,
  Shield,
  Search,
  FileCheck,
  MapPin,
  Send,
  Download,
  Sparkles,
  Play,
  FileText,
  User,
  ArrowRight,
  ChevronRight,
  Eye,
  RefreshCw,
  X,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Navigation,
} from 'lucide-react';
import {
  Incident,
  IncidentPriority,
  IncidentStatus,
  UserRole,
  IncidentResponseBrief,
  IncidentAuditLog,
  UserProfile,
} from '../../types';
import { IncidentActionChecklist } from '../IncidentActionChecklist';
import { loadStoredData, saveStoredData } from '../../utils/storage';
import { INITIAL_MOCK_INCIDENTS } from '../../data/incidentMockData';
import { jsPDF } from 'jspdf';

interface EmergencyResponseViewProps {
  userProfile: UserProfile;
}

const ROLES: UserRole[] = ['USER', 'ADMIN', 'HOSPITAL', 'AUTHORITY', 'INVESTIGATOR', 'REVIEWER'];

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  USER: 'Patient / Citizen View - Shows personal emergency requests & profile incidents',
  ADMIN: 'System Super Admin - Unrestricted access across all operational tiers',
  HOSPITAL: 'Hospital / ER Staff - Hospital dispatch, trauma bay, and medical triage',
  AUTHORITY: 'EMS / Police Authority - Traffic override, critical escalations, field dispatch',
  INVESTIGATOR: 'Field Investigator - Cause analysis, evidence collection, telemetry dump',
  REVIEWER: 'Clinical Quality Reviewer - Post-incident audit, resolution & response brief',
};

export const EmergencyResponseView: React.FC<EmergencyResponseViewProps> = ({ userProfile }) => {
  // Load persistent incidents and audit logs
  const [incidents, setIncidents] = useState<Incident[]>(() =>
    loadStoredData<Incident[]>('codecure_incidents', INITIAL_MOCK_INCIDENTS)
  );
  const [auditLogs, setAuditLogs] = useState<IncidentAuditLog[]>(() =>
    loadStoredData<IncidentAuditLog[]>('codecure_incident_audit_logs', [
      {
        id: 'aud-1',
        timestamp: new Date().toLocaleTimeString(),
        user: 'System Admin',
        role: 'ADMIN',
        action: 'System Initialized',
        incidentId: 'INC-2026-001',
        description: 'Emergency Control Center initialized with persistent state engine.',
      },
    ])
  );

  // Active Role State (Hackathon Demo Switcher)
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');

  // Filter & Search State
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'My Incidents' | 'Critical' | 'Active' | 'Escalated' | 'Resolved'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Incident & Modals State
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-2026-001');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'center' | 'audit' | 'briefs'>('center');
  const [newCommentText, setNewCommentText] = useState('');
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState('');

  // Form State for New Incident
  const [newForm, setNewForm] = useState({
    patientName: 'Alex Morgan (Demo Patient)',
    incidentType: 'Cardiac Emergency',
    priority: 'Critical' as IncidentPriority,
    location: '750 Brannan St, San Francisco, CA',
    description: 'Acute onset of dyspnea and tachycardia reported via smart wearable sensor.',
    emergencyContact: 'Rachel Morgan - +1 (555) 987-6543',
    assignedHospital: 'CodeCure City Medical Trauma Center',
    assignedAuthority: 'Metro Emergency Medical Services (EMS)',
  });

  // Dispatch Form Modal State
  const [dispatchForm, setDispatchForm] = useState({
    hospital: 'CodeCure City Medical Trauma Center',
    team: 'Paramedic Rescue Unit #42',
    notes: 'Priority-1 blue response code with traffic override clearance.',
    eta: '5 minutes',
  });

  // Save changes to persistent storage
  useEffect(() => {
    saveStoredData('codecure_incidents', incidents);
  }, [incidents]);

  useEffect(() => {
    saveStoredData('codecure_incident_audit_logs', auditLogs);
  }, [auditLogs]);

  // Log audit helper
  const addAuditLog = (action: string, incidentId: string, description: string) => {
    const newLog: IncidentAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      user: `${userProfile.name} (${currentRole})`,
      role: currentRole,
      action,
      incidentId,
      description,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Role Filtering logic
  const getRoleFilteredIncidents = () => {
    let list = incidents;

    if (currentRole === 'USER') {
      list = list.filter(
        (i) => i.reportedBy.includes('Self') || i.patientName.includes('Demo') || i.patientName.includes(userProfile.name)
      );
    } else if (currentRole === 'HOSPITAL') {
      list = list.filter((i) => i.assignedHospital.toLowerCase().includes('codecure') || i.status === 'Dispatched' || i.status === 'Dispatch Pending');
    } else if (currentRole === 'AUTHORITY') {
      list = list.filter((i) => i.priority === 'Critical' || i.priority === 'High' || i.status === 'Escalated');
    } else if (currentRole === 'INVESTIGATOR') {
      list = list.filter((i) => i.status === 'Under Investigation' || i.status === 'Escalated' || i.assignedInvestigator);
    } else if (currentRole === 'REVIEWER') {
      list = list.filter((i) => i.status === 'Resolved' || i.status === 'Closed' || i.progress >= 80);
    }

    // Apply Tab Filter
    if (activeTabFilter === 'My Incidents') {
      list = list.filter((i) => i.reportedBy.includes(userProfile.name) || i.patientName.includes(userProfile.name));
    } else if (activeTabFilter === 'Critical') {
      list = list.filter((i) => i.priority === 'Critical');
    } else if (activeTabFilter === 'Active') {
      list = list.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed');
    } else if (activeTabFilter === 'Escalated') {
      list = list.filter((i) => i.status === 'Escalated');
    } else if (activeTabFilter === 'Resolved') {
      list = list.filter((i) => i.status === 'Resolved' || i.status === 'Closed');
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.patientName.toLowerCase().includes(q) ||
          i.incidentType.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const visibleIncidents = getRoleFilteredIncidents();

  // Summary Metrics Calculations
  const totalActive = incidents.filter((i) => i.status !== 'Resolved' && i.status !== 'Closed').length;
  const totalCritical = incidents.filter((i) => i.priority === 'Critical').length;
  const totalAwaitingDispatch = incidents.filter((i) => i.status === 'Dispatch Pending' || i.status === 'Reported').length;
  const totalInProgress = incidents.filter((i) => i.status === 'Dispatched' || i.status === 'Under Investigation').length;
  const totalEscalated = incidents.filter((i) => i.status === 'Escalated').length;
  const totalResolvedToday = incidents.filter((i) => i.status === 'Resolved' || i.status === 'Closed').length;

  // Toggle Checklist Item Action
  const handleToggleChecklistItem = (itemId: string) => {
    if (!selectedIncident) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== selectedIncident.id) return inc;

        const updatedChecklist = inc.checklist.map((chk) => {
          if (chk.id !== itemId) return chk;
          const nextStatus = chk.status === 'completed' ? 'pending' : 'completed';
          return {
            ...chk,
            status: nextStatus as 'pending' | 'completed',
            completedBy: nextStatus === 'completed' ? `${userProfile.name} (${currentRole})` : undefined,
            completedAt: nextStatus === 'completed' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        });

        const completedCount = updatedChecklist.filter((c) => c.status === 'completed').length;
        const newProgress = Math.round((completedCount / updatedChecklist.length) * 100);

        return {
          ...inc,
          checklist: updatedChecklist,
          progress: newProgress,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    const toggledItem = selectedIncident.checklist.find((c) => c.id === itemId);
    addAuditLog(
      'Checklist Updated',
      selectedIncident.id,
      `Action "${toggledItem?.title}" updated by ${currentRole}.`
    );
  };

  // Create Incident
  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INC-2026-00${incidents.length + 1}`;

    const newIncident: Incident = {
      id: newId,
      patientName: newForm.patientName,
      patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      incidentType: newForm.incidentType,
      priority: newForm.priority,
      location: newForm.location,
      description: newForm.description,
      reportedBy: `${userProfile.name} (${currentRole})`,
      emergencyContact: newForm.emergencyContact,
      assignedHospital: newForm.assignedHospital,
      assignedAuthority: newForm.assignedAuthority,
      status: 'Reported',
      progress: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklist: [
        { id: `chk-${Date.now()}-1`, title: 'Incident Acknowledged', description: 'Log incoming incident report.', status: 'completed', responsibleRole: 'ADMIN', completedBy: userProfile.name, completedAt: 'Just now' },
        { id: `chk-${Date.now()}-2`, title: 'Patient Profile & Medical ID Reviewed', description: 'Check medical records.', status: 'pending', responsibleRole: 'USER' },
        { id: `chk-${Date.now()}-3`, title: 'Emergency Contact Notified', description: 'Alert designated emergency contact.', status: 'pending', responsibleRole: 'ADMIN' },
        { id: `chk-${Date.now()}-4`, title: 'Dispatch Initiated', description: 'Dispatch paramedic unit.', status: 'pending', responsibleRole: 'HOSPITAL' },
        { id: `chk-${Date.now()}-5`, title: 'Hospital ER Arrival Acknowledged', description: 'Prepare emergency trauma bay.', status: 'pending', responsibleRole: 'HOSPITAL' },
        { id: `chk-${Date.now()}-6`, title: 'Local Emergency Authority Notified', description: 'Coordinate traffic clearance.', status: 'pending', responsibleRole: 'AUTHORITY' },
        { id: `chk-${Date.now()}-7`, title: 'Incident Escalation Protocol', description: 'Assess escalation tier.', status: 'pending', responsibleRole: 'AUTHORITY' },
        { id: `chk-${Date.now()}-8`, title: 'Field Investigation & Root Cause Notes', description: 'Investigate telemetry logs.', status: 'pending', responsibleRole: 'INVESTIGATOR' },
        { id: `chk-${Date.now()}-9`, title: 'Resolution Confirmation', description: 'Confirm patient stabilization.', status: 'pending', responsibleRole: 'REVIEWER' },
        { id: `chk-${Date.now()}-10`, title: 'Final Response Report Completed', description: 'Publish final report.', status: 'pending', responsibleRole: 'REVIEWER' },
      ],
      timeline: [
        { id: `t-${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Incident Created', role: currentRole, user: userProfile.name, description: `Incident ${newId} logged with priority ${newForm.priority}.` },
      ],
      comments: [],
    };

    setIncidents([newIncident, ...incidents]);
    setSelectedIncidentId(newId);
    setShowCreateModal(false);
    addAuditLog('Incident Created', newId, `New ${newForm.priority} ${newForm.incidentType} created.`);
  };

  // Dispatch Action
  const handleConfirmDispatch = () => {
    if (!selectedIncident) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== selectedIncident.id) return inc;
        const nextChecklist = inc.checklist.map((c) =>
          c.title.includes('Dispatch')
            ? { ...c, status: 'completed' as const, completedBy: `${userProfile.name} (HOSPITAL)`, completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : c
        );
        const completedCount = nextChecklist.filter((c) => c.status === 'completed').length;
        return {
          ...inc,
          status: 'Dispatched',
          checklist: nextChecklist,
          progress: Math.round((completedCount / nextChecklist.length) * 100),
          timeline: [
            ...inc.timeline,
            { id: `t-${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Dispatch Initiated', role: 'HOSPITAL', user: userProfile.name, description: `Unit ${dispatchForm.team} dispatched to ${inc.location}. ETA: ${dispatchForm.eta}.` },
          ],
        };
      })
    );

    setShowDispatchModal(false);
    addAuditLog('Dispatch Initiated', selectedIncident.id, `Simulated dispatch: ${dispatchForm.team} assigned.`);
  };

  // Contact Action
  const handleConfirmContact = () => {
    if (!selectedIncident) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== selectedIncident.id) return inc;
        const nextChecklist = inc.checklist.map((c) =>
          c.title.includes('Contact')
            ? { ...c, status: 'completed' as const, completedBy: `${userProfile.name} (ADMIN)`, completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : c
        );
        return {
          ...inc,
          checklist: nextChecklist,
          timeline: [
            ...inc.timeline,
            { id: `t-${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Emergency Contact Alerted', role: 'ADMIN', user: userProfile.name, description: `Demo notification delivered to ${inc.emergencyContact}.` },
          ],
        };
      })
    );

    setShowContactModal(false);
    addAuditLog('Contact Notified', selectedIncident.id, `Recorded contact notification to ${selectedIncident.emergencyContact}`);
  };

  // Escalate Action
  const handleConfirmEscalate = () => {
    if (!selectedIncident) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== selectedIncident.id) return inc;
        const nextChecklist = inc.checklist.map((c) =>
          c.title.includes('Escalation')
            ? { ...c, status: 'completed' as const, completedBy: `${userProfile.name} (AUTHORITY)`, completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            : c
        );
        return {
          ...inc,
          priority: 'Critical',
          status: 'Escalated',
          checklist: nextChecklist,
          timeline: [
            ...inc.timeline,
            { id: `t-${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Incident Escalated', role: 'AUTHORITY', user: userProfile.name, description: `Incident priority escalated to Critical. Severity tier boosted.` },
          ],
        };
      })
    );

    setShowEscalateModal(false);
    addAuditLog('Incident Escalated', selectedIncident.id, 'Priority escalated to Level-1 Critical Trauma.');
  };

  // Resolve Action
  const handleConfirmResolve = () => {
    if (!selectedIncident) return;

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== selectedIncident.id) return inc;
        const allCompletedChecklist = inc.checklist.map((c) => ({
          ...c,
          status: 'completed' as const,
          completedBy: c.completedBy || `${userProfile.name} (${currentRole})`,
          completedAt: c.completedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        return {
          ...inc,
          status: 'Resolved',
          progress: 100,
          resolvedAt: new Date().toISOString(),
          checklist: allCompletedChecklist,
          timeline: [
            ...inc.timeline,
            { id: `t-${Date.now()}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), action: 'Incident Resolved', role: currentRole, user: userProfile.name, description: 'All operational actions verified. Incident marked as Resolved.' },
          ],
        };
      })
    );

    setShowResolveModal(false);
    addAuditLog('Incident Resolved', selectedIncident.id, 'Incident status changed to Resolved.');
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedIncident) return;

    const comment = {
      id: `c-${Date.now()}`,
      author: userProfile.name,
      role: currentRole,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: newCommentText.trim(),
    };

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== selectedIncident.id) return inc;
        return {
          ...inc,
          comments: [...inc.comments, comment],
          timeline: [
            ...inc.timeline,
            { id: `t-${Date.now()}`, timestamp: comment.timestamp, action: 'Comment Added', role: currentRole, user: userProfile.name, description: `Note: "${comment.message}"` },
          ],
        };
      })
    );

    setNewCommentText('');
    addAuditLog('Comment Added', selectedIncident.id, `Comment by ${currentRole}: ${comment.message}`);
  };

  // Generate AI Response Brief via Gemini
  const handleGenerateBrief = async () => {
    if (!selectedIncident) return;
    setIsGeneratingBrief(true);

    let summaryText = '';
    let recommendations: string[] = [];

    try {
      const res = await fetch('/api/gemini/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident: selectedIncident }),
      });
      if (res.ok) {
        const data = await res.json();
        summaryText = data.summary || summaryText;
        recommendations = data.recommendations || recommendations;
      }
    } catch (e) {
      console.warn('Gemini brief generation fallback:', e);
    }

    if (!summaryText) {
      summaryText = `Operational brief for ${selectedIncident.id} (${selectedIncident.incidentType}). Patient ${selectedIncident.patientName} dispatched to ${selectedIncident.assignedHospital}. Triage level: ${selectedIncident.priority}.`;
      recommendations = [
        'Maintain continuous telemetry synchronization via connected Wearable pipeline.',
        'Ensure direct radio contact between trauma center and local dispatch.',
        'Schedule post-incident debrief with chief medical officer upon resolution.',
      ];
    }

    const generatedBrief: IncidentResponseBrief = {
      id: `brief-${Date.now()}`,
      incidentId: selectedIncident.id,
      generatedAt: new Date().toLocaleString(),
      generatedBy: `${userProfile.name} (${currentRole})`,
      priority: selectedIncident.priority,
      status: selectedIncident.status,
      summary: summaryText,
      patientInfo: `${selectedIncident.patientName} (${selectedIncident.patientId || 'PT-9000'})`,
      locationNotes: selectedIncident.location,
      timelineSummary: `${selectedIncident.timeline.length} timeline events recorded.`,
      assignedResources: `Hospital: ${selectedIncident.assignedHospital} | Authority: ${selectedIncident.assignedAuthority}`,
      completedActions: selectedIncident.checklist.filter((c) => c.status === 'completed').map((c) => c.title),
      pendingActions: selectedIncident.checklist.filter((c) => c.status === 'pending').map((c) => c.title),
      aiRecommendations: recommendations,
      resolutionStatus: selectedIncident.status === 'Resolved' ? 'Fully Stabilized' : 'Operational Response In-Progress',
      nextStep: selectedIncident.status === 'Resolved' ? 'Archived in Audit Trail' : 'Execute Pending Action Checklist',
    };

    setIncidents((prev) =>
      prev.map((inc) => (inc.id === selectedIncident.id ? { ...inc, brief: generatedBrief } : inc))
    );

    setIsGeneratingBrief(false);
    addAuditLog('AI Brief Generated', selectedIncident.id, 'AI Response Brief created.');
  };

  // Download PDF Brief via jsPDF
  const handleDownloadPDF = () => {
    if (!selectedIncident) return;
    const brief = selectedIncident.brief;

    const doc = new jsPDF();

    // Header Branding
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(59, 130, 246); // blue-500
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CODECURE AI', 15, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('EMERGENCY INCIDENT RESPONSE BRIEF', 15, 28);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 150, 28);

    // Section 1: Incident Metadata
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text(`INCIDENT ID: ${selectedIncident.id}`, 15, 52);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Priority: ${selectedIncident.priority.toUpperCase()}`, 15, 60);
    doc.text(`Status: ${selectedIncident.status.toUpperCase()}`, 70, 60);
    doc.text(`Progress: ${selectedIncident.progress}% Completed`, 130, 60);

    doc.setDrawColor(226, 232, 240);
    doc.line(15, 65, 195, 65);

    // Section 2: Patient & Location
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT & LOCATION', 15, 75);

    doc.setFont('helvetica', 'normal');
    doc.text(`Patient: ${selectedIncident.patientName}`, 15, 83);
    doc.text(`Location: ${selectedIncident.location}`, 15, 90);
    doc.text(`Assigned Hospital: ${selectedIncident.assignedHospital}`, 15, 97);
    doc.text(`Assigned Authority: ${selectedIncident.assignedAuthority}`, 15, 104);

    doc.line(15, 110, 195, 110);

    // Section 3: Operational Summary
    doc.setFont('helvetica', 'bold');
    doc.text('OPERATIONAL BRIEF SUMMARY', 15, 120);

    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(brief?.summary || selectedIncident.description, 180);
    doc.text(splitSummary, 15, 128);

    const summaryY = 128 + splitSummary.length * 6;

    // Section 4: AI Operational Recommendations
    doc.setFont('helvetica', 'bold');
    doc.text('AI OPERATIONAL RECOMMENDATIONS', 15, summaryY + 10);

    doc.setFont('helvetica', 'normal');
    let recY = summaryY + 18;
    const recs = brief?.aiRecommendations || [
      'Maintain continuous biometrics via Wearable sync.',
      'Ensure direct radio dispatch contact.',
      'Log audit record post-resolution.',
    ];
    recs.forEach((rec, idx) => {
      doc.text(`${idx + 1}. ${rec}`, 20, recY);
      recY += 7;
    });

    // Disclaimer Footer
    doc.setFillColor(241, 245, 249);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CONFIDENTIAL - CODECURE AI EMERGENCY INCIDENT RESPONSE SYSTEM', 15, 278);
    doc.text('AI-generated operational summary for hackathon demonstration. Verify critical medical data before taking action.', 15, 283);

    doc.save(`CodeCure_Incident_Response_${selectedIncident.id}.pdf`);
    addAuditLog('PDF Brief Downloaded', selectedIncident.id, 'Official PDF Brief downloaded.');
  };

  // One-Click Hackathon Demo Runner
  const handleRunEmergencyDemo = async () => {
    setIsDemoRunning(true);
    setDemoStep('Step 1/6: Generating Critical Incident INC-2026-DEMO...');

    const demoId = `INC-DEMO-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create Incident
    const demoIncident: Incident = {
      id: demoId,
      patientName: 'David Miller (Demo Subject)',
      patientId: 'PT-7700',
      incidentType: 'Cardiac Emergency',
      priority: 'Critical',
      location: '100 Howard St, San Francisco, CA',
      description: 'Acute ventricular arrhythmia detected automatically by CodeCure AI Wearable engine.',
      reportedBy: 'CodeCure AI Telemetry Engine',
      emergencyContact: 'Sarah Miller (Wife) - +1 (555) 777-8888',
      assignedHospital: 'CodeCure City Medical Trauma Center',
      assignedAuthority: 'Metro EMS & Police Response',
      status: 'Reported',
      progress: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklist: [
        { id: `dchk-1`, title: 'Incident Acknowledged', description: 'Alert logged in control center.', status: 'completed', responsibleRole: 'ADMIN', completedBy: 'System Auto-Engine', completedAt: '10:00 AM' },
        { id: `dchk-2`, title: 'Patient Profile & Medical ID Reviewed', description: 'Review medical history.', status: 'pending', responsibleRole: 'USER' },
        { id: `dchk-3`, title: 'Emergency Contact Notified', description: 'Notify emergency contact.', status: 'pending', responsibleRole: 'ADMIN' },
        { id: `dchk-4`, title: 'Dispatch Initiated', description: 'Dispatch paramedic unit.', status: 'pending', responsibleRole: 'HOSPITAL' },
        { id: `dchk-5`, title: 'Hospital Contacted', description: 'Prepare trauma bay.', status: 'pending', responsibleRole: 'HOSPITAL' },
        { id: `dchk-6`, title: 'Authority Notified', description: 'Traffic override clearance.', status: 'pending', responsibleRole: 'AUTHORITY' },
        { id: `dchk-7`, title: 'Incident Escalated', description: 'Escalate trauma level.', status: 'pending', responsibleRole: 'AUTHORITY' },
        { id: `dchk-8`, title: 'Investigation Started', description: 'Dump telemetry log.', status: 'pending', responsibleRole: 'INVESTIGATOR' },
        { id: `dchk-9`, title: 'Resolution Confirmed', description: 'Confirm stabilization.', status: 'pending', responsibleRole: 'REVIEWER' },
        { id: `dchk-10`, title: 'Final Response Report Completed', description: 'Publish final report.', status: 'pending', responsibleRole: 'REVIEWER' },
      ],
      timeline: [
        { id: `dt-1`, timestamp: '10:00 AM', action: 'Incident Created', role: 'ADMIN', user: 'CodeCure AI Engine', description: `Critical telemetry incident ${demoId} initialized.` },
      ],
      comments: [],
    };

    setIncidents((prev) => [demoIncident, ...prev]);
    setSelectedIncidentId(demoId);

    // Step 2: Contact Notification
    await new Promise((r) => setTimeout(r, 1200));
    setDemoStep('Step 2/6: Executing Emergency Contact Notification...');
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id !== demoId) return i;
        const updatedChk = i.checklist.map((c) =>
          c.id === 'dchk-3' ? { ...c, status: 'completed' as const, completedBy: 'Demo Admin', completedAt: '10:01 AM' } : c
        );
        return {
          ...i,
          checklist: updatedChk,
          progress: 30,
          timeline: [...i.timeline, { id: `dt-2`, timestamp: '10:01 AM', action: 'Contact Alerted', role: 'ADMIN', user: 'Demo Admin', description: 'Sarah Miller alerted via SMS.' }],
        };
      })
    );

    // Step 3: Hospital Dispatch
    await new Promise((r) => setTimeout(r, 1400));
    setDemoStep('Step 3/6: Initiating Paramedic Unit Dispatch...');
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id !== demoId) return i;
        const updatedChk = i.checklist.map((c) =>
          c.id === 'dchk-4' || c.id === 'dchk-5'
            ? { ...c, status: 'completed' as const, completedBy: 'Hospital Dispatch', completedAt: '10:03 AM' }
            : c
        );
        return {
          ...i,
          status: 'Dispatched',
          checklist: updatedChk,
          progress: 60,
          timeline: [...i.timeline, { id: `dt-3`, timestamp: '10:03 AM', action: 'Dispatch Active', role: 'HOSPITAL', user: 'Hospital Dispatch', description: 'Unit #42 en route to 100 Howard St.' }],
        };
      })
    );

    // Step 4: Escalation
    await new Promise((r) => setTimeout(r, 1400));
    setDemoStep('Step 4/6: Authority Traffic Clearance & Escalation...');
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id !== demoId) return i;
        const updatedChk = i.checklist.map((c) =>
          c.id === 'dchk-6' || c.id === 'dchk-7'
            ? { ...c, status: 'completed' as const, completedBy: 'Police Authority', completedAt: '10:05 AM' }
            : c
        );
        return {
          ...i,
          status: 'Escalated',
          checklist: updatedChk,
          progress: 80,
          timeline: [...i.timeline, { id: `dt-4`, timestamp: '10:05 AM', action: 'Escalated', role: 'AUTHORITY', user: 'Police Authority', description: 'Traffic override active on Howard St.' }],
        };
      })
    );

    // Step 5: Resolution & AI Brief
    await new Promise((r) => setTimeout(r, 1600));
    setDemoStep('Step 5/6: Resolving Incident & Generating AI Response Brief...');
    setIncidents((prev) =>
      prev.map((i) => {
        if (i.id !== demoId) return i;
        const allDone = i.checklist.map((c) => ({
          ...c,
          status: 'completed' as const,
          completedBy: 'Clinical Reviewer',
          completedAt: '10:10 AM',
        }));
        return {
          ...i,
          status: 'Resolved',
          progress: 100,
          resolvedAt: new Date().toISOString(),
          checklist: allDone,
          timeline: [...i.timeline, { id: `dt-5`, timestamp: '10:10 AM', action: 'Resolved', role: 'REVIEWER', user: 'Chief Reviewer', description: 'Patient stabilized. Hackathon demo run complete.' }],
          brief: {
            id: `brief-demo`,
            incidentId: demoId,
            generatedAt: '10:10 AM',
            generatedBy: 'CodeCure AI Demo Engine',
            priority: 'Critical',
            status: 'Resolved',
            summary: `Automated live hackathon incident demo executed for ${demoId}. Rapid 10-minute dispatch sequence stabilized cardiac arrhythmia.`,
            patientInfo: 'David Miller (PT-7700)',
            locationNotes: '100 Howard St, San Francisco, CA',
            timelineSummary: '5 timeline events recorded.',
            assignedResources: 'CodeCure City Medical & Metro EMS',
            completedActions: allDone.map((c) => c.title),
            pendingActions: [],
            aiRecommendations: [
              'Discharge patient after 24h continuous telemetry check.',
              'Update Wearable baseline alert sensitivity.',
            ],
            resolutionStatus: '100% Actions Complete',
            nextStep: 'Archived for Review',
          },
        };
      })
    );

    await new Promise((r) => setTimeout(r, 800));
    setIsDemoRunning(false);
    setDemoStep('');
    addAuditLog('Hackathon Demo Executed', demoId, 'Complete incident lifecycle executed successfully.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Executive Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-6 sm:p-8 text-slate-100 shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Siren className="w-4 h-4 text-rose-400 animate-pulse" /> Emergency Incident Response Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Emergency & Incident Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Coordinate critical medical emergencies through structured, role-aware workflows, persistent action checklists, and AI response briefs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleRunEmergencyDemo}
              disabled={isDemoRunning}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isDemoRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> {demoStep || 'Executing Demo...'}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Run Emergency Demo
                </>
              )}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Incident
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards with Animated Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">Active Incidents</div>
          <div className="text-2xl font-black text-white">{totalActive}</div>
          <div className="text-[10px] text-blue-400 font-medium">In Response System</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-rose-500/30 space-y-1">
          <div className="text-[10px] font-bold uppercase text-rose-300">Critical</div>
          <div className="text-2xl font-black text-rose-400">{totalCritical}</div>
          <div className="text-[10px] text-rose-300 font-medium">Level 1 Priority</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-amber-500/30 space-y-1">
          <div className="text-[10px] font-bold uppercase text-amber-300">Awaiting Dispatch</div>
          <div className="text-2xl font-black text-amber-400">{totalAwaitingDispatch}</div>
          <div className="text-[10px] text-amber-300 font-medium">Pending Triage</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-1">
          <div className="text-[10px] font-bold uppercase text-slate-400">In Progress</div>
          <div className="text-2xl font-black text-cyan-400">{totalInProgress}</div>
          <div className="text-[10px] text-cyan-300 font-medium">Paramedics Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-purple-500/30 space-y-1">
          <div className="text-[10px] font-bold uppercase text-purple-300">Escalated</div>
          <div className="text-2xl font-black text-purple-400">{totalEscalated}</div>
          <div className="text-[10px] text-purple-300 font-medium">Traffic Override</div>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-emerald-500/30 space-y-1">
          <div className="text-[10px] font-bold uppercase text-emerald-300">Resolved Today</div>
          <div className="text-2xl font-black text-emerald-400">{totalResolvedToday}</div>
          <div className="text-[10px] text-emerald-300 font-medium">Audit Stored</div>
        </div>
      </div>

      {/* Hackathon Demo Role Switcher Bar */}
      <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-blue-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black tracking-widest uppercase">
              DEMO MODE
            </span>
            <h3 className="font-extrabold text-sm text-white">Hackathon Demo Role Switcher</h3>
          </div>

          <div className="text-xs text-slate-400">
            Active Role: <span className="font-bold text-blue-400">{currentRole}</span> | Visible Incidents: <span className="font-bold text-white">{visibleIncidents.length}</span>
          </div>
        </div>

        {/* Role Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {ROLES.map((role) => {
            const isActive = currentRole === role;
            return (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`p-2.5 rounded-2xl text-xs font-bold transition-all text-center flex flex-col items-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border border-blue-400/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <span>{role}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-400 italic">
          💡 {ROLE_DESCRIPTIONS[currentRole]}
        </p>
      </div>

      {/* Sub-View Selector (Center | Audit Logs | Response Briefs) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-semibold">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveSubView('center')}
            className={`pb-2 border-b-2 transition-colors ${
              activeSubView === 'center' ? 'border-blue-400 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Incident Control Center
          </button>
          <button
            onClick={() => setActiveSubView('audit')}
            className={`pb-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubView === 'audit' ? 'border-blue-400 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Persistent Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {(['All', 'My Incidents', 'Critical', 'Active', 'Escalated', 'Resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                activeTabFilter === tab
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SUBVIEW: AUDIT TRAIL */}
      {activeSubView === 'audit' && (
        <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" /> Immutable Operational Audit Trail
            </h3>
            <span className="text-xs text-slate-400">Recorded to local persistent state</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-300">{log.action}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">{log.incidentId}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{log.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-slate-400">{log.user}</div>
                  <div className="text-[9px] text-slate-500">{log.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBVIEW: INCIDENT CONTROL CENTER */}
      {activeSubView === 'center' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Incidents Table / List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search incident ID, patient, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="space-y-3">
              {visibleIncidents.length === 0 ? (
                <div className="p-8 text-center bg-white/5 border border-white/10 rounded-3xl text-slate-400 text-xs">
                  No incidents match the active role filter ({currentRole}).
                </div>
              ) : (
                visibleIncidents.map((inc) => {
                  const isSelected = selectedIncidentId === inc.id;
                  const priorityColor =
                    inc.priority === 'Critical'
                      ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                      : inc.priority === 'High'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                      : 'border-blue-500/40 bg-blue-500/10 text-blue-300';

                  return (
                    <div
                      key={inc.id}
                      onClick={() => setSelectedIncidentId(inc.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-white">{inc.id}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
                            {inc.priority}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{inc.status}</span>
                      </div>

                      <div>
                        <div className="font-bold text-sm text-slate-100">{inc.incidentType}</div>
                        <p className="text-xs text-slate-300 line-clamp-1">{inc.patientName}</p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1 truncate max-w-[180px]">
                          <MapPin className="w-3 h-3 text-blue-400 shrink-0" /> {inc.location}
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-white shrink-0">
                          Progress: <span className="text-blue-400">{inc.progress}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Incident Detailed Master View (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedIncident ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 space-y-6 shadow-2xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl font-black text-white">{selectedIncident.id}</span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          selectedIncident.priority === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {selectedIncident.priority}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-slate-200">
                        {selectedIncident.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Patient: <span className="font-bold text-slate-200">{selectedIncident.patientName}</span> ({selectedIncident.patientId})
                    </p>
                  </div>

                  {/* Primary Workflow Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {currentRole === 'HOSPITAL' || currentRole === 'ADMIN' ? (
                      <button
                        onClick={() => setShowDispatchModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        <Navigation className="w-3.5 h-3.5" /> Dispatch
                      </button>
                    ) : null}

                    {currentRole === 'ADMIN' ? (
                      <button
                        onClick={() => setShowContactModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
                      >
                        Notify Contact
                      </button>
                    ) : null}

                    {currentRole === 'AUTHORITY' || currentRole === 'ADMIN' ? (
                      <button
                        onClick={() => setShowEscalateModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                      >
                        Escalate
                      </button>
                    ) : null}

                    {currentRole === 'REVIEWER' || currentRole === 'ADMIN' ? (
                      <button
                        onClick={() => setShowResolveModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/20"
                      >
                        Resolve
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Key Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Incident Type</span>
                    <div className="font-bold text-white text-sm">{selectedIncident.incidentType}</div>
                    <div className="text-slate-400 text-[11px]">{selectedIncident.description}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Location & Route</span>
                    <div className="font-bold text-blue-300 text-xs flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {selectedIncident.location}
                    </div>
                    <div className="text-slate-400 text-[11px]">Reported by: {selectedIncident.reportedBy}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Hospital</span>
                    <div className="font-bold text-slate-200">{selectedIncident.assignedHospital}</div>
                    <div className="text-slate-400 text-[11px]">Emergency Contact: {selectedIncident.emergencyContact}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Assigned Authority</span>
                    <div className="font-bold text-slate-200">{selectedIncident.assignedAuthority}</div>
                    <div className="text-slate-400 text-[11px]">
                      Investigator: {selectedIncident.assignedInvestigator || 'Unassigned'}
                    </div>
                  </div>
                </div>

                {/* ACTION CHECKLIST COMPONENT */}
                <IncidentActionChecklist
                  items={selectedIncident.checklist}
                  currentRole={currentRole}
                  onToggleItem={handleToggleChecklistItem}
                />

                {/* TIMELINE */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" /> Chronological Event Timeline
                  </h3>
                  <div className="space-y-3 relative pl-4 border-l-2 border-blue-500/30">
                    {selectedIncident.timeline.map((evt) => (
                      <div key={evt.id} className="relative space-y-0.5 text-xs">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-slate-900" />
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{evt.action}</span>
                          <span className="text-[10px] font-mono text-slate-400">{evt.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{evt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI RESPONSE BRIEF SECTION */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-blue-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <h3 className="font-extrabold text-sm text-white">AI Incident Response Brief</h3>
                      </div>
                      <p className="text-xs text-slate-400">Structured operational report generated by CodeCure AI.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGenerateBrief}
                        disabled={isGeneratingBrief}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50"
                      >
                        {isGeneratingBrief ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" /> Generate Brief
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownloadPDF}
                        disabled={!selectedIncident.brief}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-100 font-bold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </button>
                    </div>
                  </div>

                  {selectedIncident.brief ? (
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-blue-400">Brief Operational Summary</div>
                        <p className="text-slate-200 mt-0.5 leading-relaxed">{selectedIncident.brief.summary}</p>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-400">AI Recommendations</div>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 mt-1">
                          {selectedIncident.brief.aiRecommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[10px] text-slate-500 italic pt-2 border-t border-white/5">
                        ⚠️ AI-generated operational summary. Verify critical information before taking action.
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-400">
                      Click "Generate Brief" above to compile AI operational recommendations and download the PDF brief.
                    </div>
                  )}
                </div>

                {/* OPERATIONAL COMMENTS */}
                <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" /> Operational Comments
                  </h3>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {selectedIncident.comments.map((c) => (
                      <div key={c.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-xs space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-200">
                          <span>{c.author} ({c.role})</span>
                          <span className="text-[10px] font-mono text-slate-500">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-300">{c.message}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add operational note or comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-40 transition-colors"
                    >
                      Post Note
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* MODAL: CREATE INCIDENT */}
      {showCreateModal && (
        <div role="dialog" aria-modal="true" aria-label="Create Incident" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-base text-white">+ Create Emergency Incident</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Patient Name</label>
                <input type="text" required value={newForm.patientName} onChange={(e) => setNewForm({ ...newForm, patientName: e.target.value })} className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Incident Type</label>
                  <select value={newForm.incidentType} onChange={(e) => setNewForm({ ...newForm, incidentType: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100">
                    {['Medical Emergency', 'Accident', 'Fall', 'Breathing Difficulty', 'Cardiac Emergency', 'Medication Incident', 'Mental Health Crisis', 'Other'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Priority</label>
                  <select value={newForm.priority} onChange={(e) => setNewForm({ ...newForm, priority: e.target.value as IncidentPriority })} className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-100">
                    {['Low', 'Moderate', 'High', 'Critical'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Location</label>
                <input type="text" required value={newForm.location} onChange={(e) => setNewForm({ ...newForm, location: e.target.value })} className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100" />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                <textarea rows={2} required value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">Create Incident</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH */}
      {showDispatchModal && (
        <div role="dialog" aria-modal="true" aria-label="Dispatch Unit" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-base text-white">Initiate Paramedic Dispatch</h3>
              <button onClick={() => setShowDispatchModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Response Team</label>
                <input type="text" value={dispatchForm.team} onChange={(e) => setDispatchForm({ ...dispatchForm, team: e.target.value })} className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Estimated ETA</label>
                <input type="text" value={dispatchForm.eta} onChange={(e) => setDispatchForm({ ...dispatchForm, eta: e.target.value })} className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100" />
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px]">
                Simulated hackathon dispatch workflow will set incident status to Dispatched and complete dispatch checklist items.
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowDispatchModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-slate-300">Cancel</button>
                <button onClick={handleConfirmDispatch} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">Confirm Dispatch</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOTIFY CONTACT */}
      {showContactModal && (
        <div role="dialog" aria-modal="true" aria-label="Notify Contact" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Notify Emergency Contact</h3>
            <p className="text-xs text-slate-300">
              Transmit simulated alert SMS to <span className="font-bold text-blue-400">{selectedIncident?.emergencyContact}</span>.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowContactModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-slate-300">Cancel</button>
              <button onClick={handleConfirmContact} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold">Send Alert Notification</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ESCALATE */}
      {showEscalateModal && (
        <div role="dialog" aria-modal="true" aria-label="Escalate Incident" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Escalate Incident Tier</h3>
            <p className="text-xs text-slate-300">
              Escalate priority level to <span className="font-bold text-rose-400">Critical</span> and issue traffic override clearance.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowEscalateModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-slate-300">Cancel</button>
              <button onClick={handleConfirmEscalate} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold">Confirm Escalation</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESOLVE */}
      {showResolveModal && (
        <div role="dialog" aria-modal="true" aria-label="Resolve Incident" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white">Confirm Incident Resolution</h3>
            <p className="text-xs text-slate-300">
              Mark incident {selectedIncident?.id} as Resolved. This will set checklist progress to 100% and generate the final operational report.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowResolveModal(false)} className="px-4 py-2 rounded-xl bg-white/10 text-slate-300">Cancel</button>
              <button onClick={handleConfirmResolve} className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">Resolve Incident</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

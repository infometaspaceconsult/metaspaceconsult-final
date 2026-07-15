import React, { useState } from "react";
import { Venture, DeploymentFile } from "../types";
import { DBConfig, generateSQL, generateDBPhp, generateContactPhp, generateIndexPhp } from "../data";
import { Database, FileCode, Settings, Download, Copy, Check, ExternalLink, Server, BookOpen, AlertCircle, RefreshCw, Layers } from "lucide-react";

interface CPanelWorkspaceProps {
  ventures: Venture[];
}

export default function CPanelWorkspace({ ventures }: CPanelWorkspaceProps) {
  // DB config state
  const [dbHost, setDbHost] = useState("localhost");
  const [dbName, setDbName] = useState("metaspace_db");
  const [dbUser, setDbUser] = useState("metaspace_user");
  const [dbPass, setDbPass] = useState("SecurePassword_123!");

  // Tabs
  const [activeTab, setActiveTab] = useState<"code" | "guide" | "test">("code");
  const [activeFile, setActiveFile] = useState("db.php");
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const dbConfig: DBConfig = {
    host: dbHost,
    name: dbName,
    user: dbUser,
    pass: dbPass
  };

  // Generate contents dynamically
  const sqlContent = generateSQL(dbConfig, ventures);
  const dbPhpContent = generateDBPhp(dbConfig);
  const contactPhpContent = generateContactPhp();
  const indexPhpContent = generateIndexPhp(ventures);

  const files: DeploymentFile[] = [
    {
      name: "db.php",
      language: "php",
      content: dbPhpContent,
      description: "Database connection wrapper using secure PDO Prepared Statements."
    },
    {
      name: "setup.sql",
      language: "sql",
      content: sqlContent,
      description: "SQL database setup script. Creates tables and seeds default venture data."
    },
    {
      name: "index.php",
      language: "php",
      content: indexPhpContent,
      description: "High-fidelity, responsive homepage. Fetches venture list directly from MySQL."
    },
    {
      name: "contact.php",
      language: "php",
      content: contactPhpContent,
      description: "Secure contact form processor. Prevents SQL injection and returns feedback."
    }
  ];

  const currentFileObj = files.find(f => f.name === activeFile) || files[0];

  const handleCopy = (content: string, fileName: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownload = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    files.forEach(f => {
      handleDownload(f.content, f.name);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden" id="cpanel-deployment-center">
      {/* Workspace Header */}
      <div className="bg-gradient-to-r from-deep-navy to-indigo-900 p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-innovation-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">cPanel Exporter</span>
              <span className="text-white/60 text-xs">v1.1.0</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display">PHP & MySQL Deployment Suite</h2>
            <p className="text-indigo-200 text-sm mt-1">Configure your server credentials and generate hosting-ready assets dynamically.</p>
          </div>
          <button
            onClick={handleDownloadAll}
            className="self-start md:self-auto bg-innovation-red hover:bg-opacity-90 transition-all text-white font-semibold text-xs py-3 px-5 rounded-lg flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Download className="w-4 h-4" />
            Download All files
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 border-b border-white/10 mt-8 -mb-4">
          <button
            onClick={() => setActiveTab("code")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${activeTab === "code" ? "border-innovation-red text-white" : "border-transparent text-indigo-200/60 hover:text-white"}`}
          >
            <FileCode className="w-4 h-4" />
            Generated Source Files
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${activeTab === "guide" ? "border-innovation-red text-white" : "border-transparent text-indigo-200/60 hover:text-white"}`}
          >
            <BookOpen className="w-4 h-4" />
            cPanel Installation Guide
          </button>
          <button
            onClick={() => setActiveTab("test")}
            className={`pb-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${activeTab === "test" ? "border-innovation-red text-white" : "border-transparent text-indigo-200/60 hover:text-white"}`}
          >
            <Settings className="w-4 h-4" />
            Configuration Settings
          </button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Sidebar Panel */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-deep-navy text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-innovation-red" />
              MySQL Configuration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Database Host</label>
                <input
                  type="text"
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                  placeholder="e.g. localhost"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Database Name</label>
                <input
                  type="text"
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                  placeholder="e.g. metaspace_db"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">In shared hosting, cPanel prepends your username (e.g. <code className="bg-slate-100 px-1 rounded">user_metaspace</code>)</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Database User</label>
                <input
                  type="text"
                  value={dbUser}
                  onChange={(e) => setDbUser(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                  placeholder="e.g. metaspace_user"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Database Password</label>
                <input
                  type="text"
                  value={dbPass}
                  onChange={(e) => setDbPass(e.target.value)}
                  className="w-full text-xs font-mono bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-deep-navy focus:outline-none focus:ring-1 focus:ring-deep-navy focus:border-deep-navy"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-blue-900">Dynamic Synchronization</h4>
                <p className="text-[11px] text-blue-700 leading-relaxed mt-0.5">Changing these parameters instantly modifies the DB settings inside <code className="bg-white/50 px-1 rounded">db.php</code> and the table creation schemas in <code className="bg-white/50 px-1 rounded">setup.sql</code>.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 mt-6 lg:mt-0">
            <div className="flex items-center gap-2 text-slate-500">
              <Server className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">cPanel Compatibility</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1">This package is optimized for standard PHP 7.4 to 8.3 configurations on Linux hosting with MySQL / MariaDB databases.</p>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-8 p-6 flex flex-col">
          {activeTab === "code" && (
            <div className="flex-grow flex flex-col h-full">
              {/* Selector Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3 mb-4">
                {files.map(f => (
                  <button
                    key={f.name}
                    onClick={() => setActiveFile(f.name)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${activeFile === f.name ? "bg-deep-navy text-white border-deep-navy" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>

              {/* File Info Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-deep-navy font-mono">{currentFileObj.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{currentFileObj.description}</p>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => handleCopy(currentFileObj.content, currentFileObj.name)}
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors flex items-center gap-1 text-xs font-medium"
                    title="Copy Content"
                  >
                    {copiedFile === currentFileObj.name ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDownload(currentFileObj.content, currentFileObj.name)}
                    className="p-2 bg-deep-navy hover:bg-opacity-90 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Code Pre Container */}
              <div className="flex-grow bg-slate-900 rounded-xl p-5 overflow-auto max-h-[360px] font-mono text-xs text-slate-300 border border-slate-800 relative">
                <div className="absolute top-3 right-3 bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                  {currentFileObj.language.toUpperCase()}
                </div>
                <pre className="whitespace-pre">{currentFileObj.content}</pre>
              </div>
            </div>
          )}

          {activeTab === "guide" && (
            <div className="space-y-6 overflow-y-auto max-h-[480px] pr-2">
              <h3 className="font-bold text-deep-navy text-lg font-display mb-4">Step-by-Step Hosting Deployment Guide</h3>

              {/* Step 1 */}
              <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm flex gap-4">
                <div className="w-8 h-8 rounded-full bg-deep-navy text-white font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-deep-navy text-sm">Create the Database in cPanel</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Log in to your <strong>cPanel</strong>, navigate to the <strong>Databases</strong> section, and open the <strong>MySQL® Database Wizard</strong>.
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-500 mt-2 space-y-1">
                    <li>Create a database name: <code className="bg-slate-100 px-1 rounded font-mono text-deep-navy">{dbName}</code></li>
                    <li>Create a database user: <code className="bg-slate-100 px-1 rounded font-mono text-deep-navy">{dbUser}</code></li>
                    <li>Assign a strong password: <code className="bg-slate-100 px-1 rounded font-mono text-deep-navy">{dbPass}</code></li>
                    <li>Check <strong>"ALL PRIVILEGES"</strong> when mapping the user to the database.</li>
                  </ul>
                </div>
              </div>

              {/* Step 2 */}
              <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm flex gap-4">
                <div className="w-8 h-8 rounded-full bg-deep-navy text-white font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-deep-navy text-sm">Import the Database Tables via phpMyAdmin</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Go back to the cPanel main board, look for <strong>Databases</strong>, and open <strong>phpMyAdmin</strong>.
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-500 mt-2 space-y-1">
                    <li>Select the newly created database in the left pane.</li>
                    <li>Click the <strong>Import</strong> tab at the top.</li>
                    <li>Upload the generated <code className="bg-slate-100 px-1 rounded font-mono">setup.sql</code> file, or click the <strong>SQL</strong> tab and paste its code.</li>
                    <li>Click <strong>Go / Import</strong>. Your <code className="bg-slate-100 px-1 rounded font-mono">ventures</code> and <code className="bg-slate-100 px-1 rounded font-mono">contact_messages</code> tables are now ready!</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm flex gap-4">
                <div className="w-8 h-8 rounded-full bg-deep-navy text-white font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-deep-navy text-sm">Upload Source Files to public_html</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Open cPanel's <strong>File Manager</strong>, double-click the <strong>public_html</strong> directory (or your target addon-domain folder).
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-slate-500 mt-2 space-y-1">
                    <li>Upload <code className="bg-slate-100 px-1 rounded font-mono text-deep-navy">index.php</code>, <code className="bg-slate-100 px-1 rounded font-mono text-deep-navy">db.php</code>, and <code className="bg-slate-100 px-1 rounded font-mono text-deep-navy">contact.php</code> directly inside.</li>
                    <li>Verify permissions for the files are set to standard <code className="bg-slate-100 px-1 rounded font-mono">0644</code>.</li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="border border-slate-100 rounded-xl p-5 bg-white shadow-sm flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center shrink-0">✓</div>
                <div>
                  <h4 className="font-bold text-green-700 text-sm">Test Your Live Application!</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Enter your domain name in the address bar. The homepage will pull the ventures directly from MySQL! Any user submitting a message in the contact form will be safely logged into the <code className="bg-slate-100 px-1 rounded font-mono">contact_messages</code> table.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "test" && (
            <div className="space-y-6">
              <h3 className="font-bold text-deep-navy text-lg font-display">System Capabilities Checklist</h3>
              <p className="text-xs text-slate-500">Your generated PHP and MySQL files support the following features out-of-the-box:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-deep-navy font-bold text-xs">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    Secure PDO Connections
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Connecting via PDO ensures high-level error handling, charset overrides, and complete protection against classical SQL Injection injections.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-deep-navy font-bold text-xs">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    Responsive Tailwind CDN Styling
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">The template pulls modern Tailwind styling via official CDN, allowing custom themes and immediate styling without compiling assets on cPanel.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-deep-navy font-bold text-xs">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    Dynamic MySQL Loops
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Using a clean loop structure in PHP, any venture you add/edit inside your MySQL database will automatically display on the homepage instantly.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-deep-navy font-bold text-xs">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    Anti-XSS Form Protection
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">The contact form handles name, email, subject, and messages by filtering inputs and cleaning HTML tags before saving or outputting responses.</p>
                </div>
              </div>

              <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between gap-4 mt-4">
                <div>
                  <h4 className="text-xs font-bold text-indigo-900">Need Custom Ventures added?</h4>
                  <p className="text-[11px] text-indigo-700 leading-relaxed mt-0.5">Any venture that you modify or add in the Venture Manager section of this React application is immediately factored into the dynamically generated seed code inside <code className="bg-white/50 px-1 rounded font-mono">setup.sql</code>!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

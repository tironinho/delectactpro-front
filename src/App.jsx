import { useEffect, useMemo, useState } from 'react'
import { getMarketingAttribution } from './utils/attribution.js'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import RequireAuth from './components/auth/RequireAuth.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Home from './pages/Home.jsx'
import BlogIndex from './pages/blog/BlogIndex.jsx'
import BlogArticle from './pages/blog/BlogArticle.jsx'
import BlogCategory from './pages/blog/BlogCategory.jsx'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import ToolPenaltyCalculator from './pages/tools/PenaltyCalculator.jsx'
import ToolDropReadinessChecklist from './pages/tools/DropReadinessChecklist.jsx'
import ToolDataBrokerSelfAssessment from './pages/tools/DataBrokerSelfAssessment.jsx'
import BillingSuccess from './pages/billing/BillingSuccess.jsx'
import BillingCancel from './pages/billing/BillingCancel.jsx'
import SolutionsDataBrokers from './pages/solutions/DataBrokers.jsx'
import UseCaseDropApiReadiness from './pages/use-cases/DropApiReadiness.jsx'
import PricingSetupFee from './pages/pricing/SetupFeeEarlyAccess.jsx'
import CompareManualVsAutomated from './pages/compare/ManualVsAutomated.jsx'
import Dashboard from './pages/app/Dashboard.jsx'
import Onboarding from './pages/app/Onboarding.jsx'
import Integrations from './pages/app/Integrations.jsx'
import Connectors from './pages/app/Connectors.jsx'
import CustomerApis from './pages/app/CustomerApis.jsx'
import HashRecipes from './pages/app/HashRecipes.jsx'
import MatchTester from './pages/app/MatchTester.jsx'
import Partners from './pages/app/Partners.jsx'
import CascadePolicies from './pages/app/CascadePolicies.jsx'
import Runs from './pages/app/Runs.jsx'
import RunDetails from './pages/app/RunDetails.jsx'
import AuditLogs from './pages/app/AuditLogs.jsx'
import Billing from './pages/app/Billing.jsx'
import Settings from './pages/app/Settings.jsx'

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const rootClass = useMemo(() => (isDark ? 'dark' : ''), [isDark])

  useEffect(() => {
    const html = document.documentElement
    if (rootClass) html.classList.add('dark')
    else html.classList.remove('dark')
  }, [rootClass])

  useEffect(() => {
    getMarketingAttribution()
  }, [])

  return (
    <Routes>
      {/* App (protected) — no Navbar/Footer; AppLayout has sidebar */}
      <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<Dashboard />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="connectors" element={<Connectors />} />
        <Route path="customer-apis" element={<CustomerApis />} />
        <Route path="hash-recipes" element={<HashRecipes />} />
        <Route path="match-tester" element={<MatchTester />} />
        <Route path="partners" element={<Partners />} />
        <Route path="cascade-policies" element={<CascadePolicies />} />
        <Route path="runs" element={<Runs />} />
        <Route path="runs/:runId" element={<RunDetails />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="billing" element={<Billing />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Public — Navbar + Footer */}
      <Route element={<PublicLayout isDark={isDark} onToggleDark={() => setIsDark((v) => !v)} />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/category/:categorySlug" element={<BlogCategory />} />
        <Route path="/blog/:slug" element={<BlogArticle />} />
        <Route path="/tools/penalty-calculator" element={<ToolPenaltyCalculator />} />
        <Route path="/tools/drop-readiness-checklist" element={<ToolDropReadinessChecklist />} />
        <Route path="/tools/data-broker-self-assessment" element={<ToolDataBrokerSelfAssessment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/billing/cancel" element={<BillingCancel />} />
        <Route path="/solutions/data-brokers" element={<SolutionsDataBrokers />} />
        <Route path="/use-cases/drop-api-readiness" element={<UseCaseDropApiReadiness />} />
        <Route path="/pricing/setup-fee-early-access" element={<PricingSetupFee />} />
        <Route path="/compare/manual-vs-automated-delete-act-compliance" element={<CompareManualVsAutomated />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

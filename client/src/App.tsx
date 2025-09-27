import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import TestimonialsPage from "@/pages/testimonials";
import Packages from "@/pages/packages";
import AI3DDesign from "@/pages/ai-3d-design";
import AIOptimization from "@/pages/ai-optimization";
import EcoDesign from "@/pages/eco-design";
import VirtualReality from "@/pages/virtual-reality";
import ChildSafety from "@/pages/child-safety";
import DIYPoolsAndSpas from "@/pages/diy-pools-and-spas";
import AIDesignTool from "@/pages/ai-design-tool";
import PaymentSuccess from "@/pages/payment-success";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import AdminPage from "@/pages/admin";
import IntakePage from "@/pages/intake";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import CrispChat from "@/components/crisp-chat";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/testimonials" component={TestimonialsPage} />
      <Route path="/packages" component={Packages} />
      <Route path="/ai-3d-design" component={AI3DDesign} />
      <Route path="/ai-optimization" component={AIOptimization} />
      <Route path="/eco-design" component={EcoDesign} />
      <Route path="/virtual-reality" component={VirtualReality} />
      <Route path="/child-safety" component={ChildSafety} />
      <Route path="/diy-pools-and-spas" component={DIYPoolsAndSpas} />
      <Route path="/ai-design-tool" component={AIDesignTool} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/intake" component={IntakePage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-conditions" component={TermsConditions} />
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CrispChat />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

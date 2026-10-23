import { SupportedLanguage } from '../types';
import { TOPICS } from '../data/az900-syllabus';
import { SEED_FLASHCARDS } from '../data/seed-flashcards';
import { AZ900_STRUCTURED_NOTES } from '../data/az900-notes';

/**
 * Common greetings across English, Kiswahili, Sheng, and Nigerian Pidgin
 */
const GREETING_TOKENS = [
  'hi', 'hello', 'hey', 'habari', 'jambo', 'mambo', 'niaje', 'sasa',
  'how far', 'kedu', 'good morning', 'good afternoon', 'good evening',
  'greetings', 'yo', 'sup', 'salut', 'buda', 'vipi', 'xalas'
];

/**
 * Out-of-scope intent indicators (everyday non-cloud / non-Azure subjects)
 */
const OUT_OF_SCOPE_PHRASES = [
  'cook', 'recipe', 'food recipe', 'premier league', 'football', 'soccer',
  'world cup', 'who won', 'celebrity', 'movie', 'actor', 'music', 'song',
  'dating', 'love', 'girlfriend', 'boyfriend', 'joke about', 'python game',
  'tic tac toe', 'snake game', 'capital of', 'president of', 'weather today',
  'crypto', 'bitcoin', 'forex', 'stocks', 'medical advice', 'headache', 'diet'
];

/**
 * In-scope Azure & Cloud keywords
 */
const AZURE_CLOUD_KEYWORDS = [
  'azure', 'cloud', 'iaas', 'paas', 'saas', 'capex', 'opex', 'server', 'compute',
  'storage', 'blob', 'disk', 'file', 'queue', 'network', 'vnet', 'subnet', 'vpn',
  'expressroute', 'nsg', 'firewall', 'security', 'identity', 'entra', 'active directory',
  'mfa', 'conditional access', 'zero trust', 'rbac', 'role', 'policy', 'governance',
  'lock', 'cost', 'pricing', 'tco', 'sla', 'high availability', 'scalability',
  'elasticity', 'agility', 'disaster recovery', 'fault tolerance', 'region', 'zone',
  'datacenter', 'virtual machine', 'vm', 'container', 'aks', 'aci', 'app service',
  'function', 'serverless', 'monitor', 'service health', 'log analytics', 'defender',
  'purview', 'subscription', 'resource group', 'management group', 'arm', 'bicep',
  'compliance', 'trust center', 'backup', 'database', 'sql', 'cosmos', 'exam',
  'az-900', 'az900', 'microsoft', 'shared responsibility', 'consumption', 'redundancy',
  'lrs', 'zrs', 'grs', 'archive', 'cool', 'hot', 'cold', 'advisor', 'scale set',
  'defender for cloud', 'resource lock', 'virtual desktop', 'load balancer', 'public cloud',
  'private cloud', 'hybrid cloud', 'multi-cloud', 'tag', 'budget', 'billing'
];

export class RafikiEngine {
  /**
   * Check if a prompt is purely or primarily a friendly greeting
   */
  static isGreeting(rawText: string): boolean {
    const text = rawText.toLowerCase().trim();
    if (!text) return false;

    // Check if it starts with or matches a greeting and is short (<= 4 words)
    const words = text.split(/\s+/);
    if (words.length > 5) return false;

    return GREETING_TOKENS.some(token => {
      const regex = new RegExp(`(^|\\b)${token}(\\b|$)`, 'i');
      return regex.test(text);
    });
  }

  /**
   * Returns a warm greeting response adapted to the selected African language
   */
  static getGreetingResponse(lang: SupportedLanguage): string {
    switch (lang) {
      case 'Kiswahili':
        return `Jambo rafiki! Mimi ni **Rafiki**, msaidizi wako maalum wa masomo ya **Microsoft Azure Fundamentals (AZ-900)**. 🌍\n\nNipo hapa kukusaidia kuelewa kila dhana ya wingu kwa mifano rahisi ya Kiafrika. Je, ungependa kujifunza kuhusu:\n- ☁️ **Cloud Concepts** (CapEx vs OpEx, Shared Responsibility, Faida za Wingu)\n- 🏗️ **Azure Architecture** (Regions, Availability Zones, Compute, Storage, VNets)\n- 🛡️ **Azure Governance & Security** (Microsoft Entra ID, Azure Policy, RBAC, Cost Management)\n\nNiulize swali lolote la Azure sasa!`;

      case 'Sheng':
        return `Niaje msee! Ni **Rafiki**, study buddy wako wa ukweli wa **AZ-900**. 🌍\n\nForm ni gani leo? Nirushe maswali kuhusu cloud concepts, Azure servers, ama security nikupe ma-analogy za mtaani zikushike mbaya kwa exam!\n\nUnaweza niuliza: *"Explain CapEx vs OpEx"* ama *"What is an Availability Zone?"*`;

      case 'Nigerian Pidgin':
        return `How far my person! Na **Rafiki**, your correct **AZ-900 Study Buddy**. 🌍\n\nI dey here to help you understand all the cloud concepts with sharp analogies so you go pass your Microsoft exam one-time!\n\nWetin you wan make we yarn about today? Ask me anything about Cloud concepts, Azure architecture, or governance!`;

      case 'English':
      default:
        return `Habari! I am **Rafiki**, your dedicated **Microsoft Azure Fundamentals (AZ-900)** AI Study Buddy. 🌍\n\nI am here to break down abstract cloud infrastructure concepts using relatable African analogies so that they stick in your memory for the exam.\n\nWhat would you like to explore today?\n- ☁️ **Cloud Concepts** (CapEx vs. OpEx, Shared Responsibility, Cloud Models)\n- 🏗️ **Azure Architecture & Services** (Regions, Availability Zones, VMs, Storage, VNets)\n- 🛡️ **Azure Governance & Management** (RBAC, Azure Policy, Cost Management, Locks)\n\nAsk me any question or tap one of the prompt chips below!`;
    }
  }

  /**
   * Check if a prompt is outside the scope of Microsoft Azure Fundamentals
   */
  static isOutOfScope(rawText: string): boolean {
    const text = rawText.toLowerCase().trim();

    // Explicit non-course subjects
    const hasExplicitOutOfScope = OUT_OF_SCOPE_PHRASES.some(phrase => text.includes(phrase));
    if (hasExplicitOutOfScope) return true;

    // Check if it matches any cloud keyword
    const hasCloudKeyword = AZURE_CLOUD_KEYWORDS.some(k => text.includes(k));
    if (hasCloudKeyword) return false;

    // Check if it matches any syllabus topic or structured note title
    const matchesTopic = TOPICS.some(t =>
      text.includes(t.title.toLowerCase()) || text.includes(t.slug)
    );
    if (matchesTopic) return false;

    const matchesNote = AZ900_STRUCTURED_NOTES.some(n =>
      text.includes(n.title.toLowerCase()) || text.includes(n.outline_skill.toLowerCase())
    );
    if (matchesNote) return false;

    const matchesFlashcard = SEED_FLASHCARDS.some(f =>
      text.includes(f.front.toLowerCase())
    );
    if (matchesFlashcard) return false;

    // If query has 3+ words and zero relation to Azure / Cloud concepts, treat as out-of-scope
    return true;
  }

  /**
   * Returns a polite, encouraging out-of-scope notification
   */
  static getOutOfScopeAlert(lang: SupportedLanguage): string {
    return `⚠️ **Information Outside AZ-900 Scope**\n\nHujambo! I am **Rafiki**, your dedicated **Microsoft Azure Fundamentals (AZ-900)** AI Study Buddy. 🌍\n\nYour question appears to fall outside the scope of our course curriculum. To ensure you make the most of your study time and pass your exam, I can only assist with topics tested on the official AZ-900 exam:\n\n- ☁️ **Domain 1: Describe Cloud Concepts (25–30%)**\n  * CapEx vs. OpEx, Cloud models (Public/Private/Hybrid), Shared Responsibility, Cloud benefits (High Availability, Scalability, Elasticity, Agility).\n- 🏗️ **Domain 2: Describe Azure Architecture and Services (35–40%)**\n  * Regions & Availability Zones, Subscriptions, Compute (VMs, Containers, Functions), Storage (Blob, Tiers), Networking (VNets, ExpressRoute), Identity (Microsoft Entra ID).\n- 🛡️ **Domain 3: Describe Azure Management and Governance (30–35%)**\n  * Azure Policy, RBAC, Resource Locks, Cost Management, Pricing Calculator, Azure Monitor, Service Health.\n\nPlease ask any question related to Microsoft Azure Fundamentals!`;
  }

  /**
   * Generates a grounded, rich, syllabus-aligned answer with African analogies
   */
  static generateResponse(
    rawText: string,
    lang: SupportedLanguage = 'English',
    questionContext?: {
      stem: string;
      options: string[];
      correct: string[];
      explanation: string;
      outline_skill?: string;
    }
  ): string {
    const text = rawText.toLowerCase().trim();

    // 1. If question context is passed (e.g. from quiz or notes)
    if (questionContext) {
      return `**Exam Question Breakdown (${questionContext.outline_skill || 'AZ-900 Core'})**:\n\n` +
        `**Question**: "${questionContext.stem}"\n\n` +
        `**Correct Answer**: **${questionContext.correct.join(', ')}**\n\n` +
        `**Official Microsoft Explanation**:\n${questionContext.explanation}\n\n` +
        `**Why This Matters for the Exam**: Microsoft designs questions around realistic scenario constraints (such as minimizing capital expenditure, preventing accidental deletion, or ensuring regional disaster recovery). Make sure you look for key trigger words in the question stem!`;
    }

    // 2. Pure Greeting Check
    if (this.isGreeting(text)) {
      return this.getGreetingResponse(lang);
    }

    // 3. Out-of-Scope Check
    if (this.isOutOfScope(text)) {
      return this.getOutOfScopeAlert(lang);
    }

    // Language prefix
    let greetingPrefix = '';
    if (lang === 'Kiswahili') {
      greetingPrefix = 'Jambo rafiki! Hili hapa jibu lako sahihi kulingana na muhtasari wa Microsoft:\n\n';
    } else if (lang === 'Sheng') {
      greetingPrefix = 'Niaje msee! Cheki hii explanation fiti kabisa kulingana na syllabus ya Microsoft:\n\n';
    } else if (lang === 'Nigerian Pidgin') {
      greetingPrefix = 'How far my person! Make I break am down for you sharp sharp according to Microsoft standard:\n\n';
    }

    // 4. In-Scope Concept Handlers

    // CapEx vs OpEx
    if (text.includes('capex') || text.includes('opex') || text.includes('capital expenditure') || text.includes('operating expenditure') || text.includes('market stall')) {
      return `${greetingPrefix}**CapEx vs. OpEx (Cloud Economics)**:\n\n` +
        `- **CapEx (Capital Expenditure)**: Heavy upfront financial spending on physical datacenter equipment (servers, generators, air conditioning). The purchasing organization absorbs hardware depreciation and maintenance risk.\n` +
        `- **OpEx (Operational Expenditure)**: Ongoing spending on operational services consumed dynamically (pay-as-you-go). Deducted from taxes in the same billing cycle with zero upfront hardware cost.\n\n` +
        `**African Market Analogy**: CapEx is buying a commercial diesel generator in cash to power a shop in Nairobi or Lagos. OpEx is buying daily prepaid electricity tokens (tokens za stima / NEPA prepaid units) from your phone—you only pay for the exact kilowatt-hours consumed!\n\n` +
        `**AZ-900 Exam Takeaway**: Cloud computing shifts IT spending from CapEx to OpEx via a consumption-based pricing model.`;
    }

    // Shared Responsibility Model
    if (text.includes('shared responsibility') || text.includes('responsibility model')) {
      return `${greetingPrefix}**The Shared Responsibility Model**:\n\n` +
        `Security in Microsoft Azure is a shared partnership between Microsoft and the customer:\n` +
        `- **In IaaS**: Microsoft manages physical datacenter security, power, cooling, and hypervisors. You manage the guest OS, runtime, firewall rules, applications, and data.\n` +
        `- **In PaaS**: Microsoft manages physical hardware AND operating system patching. You configure application code, settings, and data.\n` +
        `- **In SaaS**: Microsoft manages the entire software application stack. You manage user accounts, data, and access permissions.\n\n` +
        `**Apartment Analogy**: Renting an apartment in Nairobi or Victoria Island: The landlord (Microsoft) maintains the building foundation, concrete walls, security perimeter, and power backup. YOU (the tenant) are always 100% responsible for locking your door, keeping your safe secure, and who you give keys to.\n\n` +
        `**Exam Golden Rule**: Regardless of cloud model (IaaS, PaaS, SaaS), the customer **ALWAYS** retains responsibility for **Information & Data**, **Devices (Endpoints)**, and **Accounts & Identities**!`;
    }

    // Availability Zones & Regions
    if (text.includes('availability zone') || text.includes('region') || text.includes('datacenter') || text.includes('danfo') || text.includes('matatu')) {
      return `${greetingPrefix}**Azure Regions & Availability Zones**:\n\n` +
        `- **Region**: A geographical area containing one or more physical datacenters connected via dedicated low-latency fiber (e.g. South Africa North in Johannesburg, South Africa West in Cape Town).\n` +
        `- **Availability Zones (AZs)**: Physically separate datacenters within the SAME Azure region. Each zone has independent power, cooling, and networking infrastructure. Minimum of 3 zones per supported region.\n` +
        `- **Region Pairs**: Each region is paired with another region within the same geography (>300 miles away) to ensure business continuity during catastrophic regional disasters.\n\n` +
        `**Matatu / Logistics Analogy**: If a logistics business puts all its goods inside one single matatu or van, a tire blowout halts all deliveries. But if goods are split across three separate vans taking different routes with independent fuel supplies, one breakdown never halts your operations!\n\n` +
        `**AZ-900 Tip**: Availability Zones protect against **datacenter-level failures**; Region Pairs protect against **regional natural disasters**.`;
    }

    // Azure Policy vs RBAC vs Locks
    if (text.includes('policy') || text.includes('rbac') || text.includes('role-based') || text.includes('lock') || text.includes('locks')) {
      return `${greetingPrefix}**Azure Policy vs. RBAC vs. Resource Locks**:\n\n` +
        `- **RBAC (Role-Based Access Control)** focuses on **WHO**: Can Amina create VMs? Can Kwame delete the database? (User authorization and permissions).\n` +
        `- **Azure Policy** focuses on **WHAT PROPERTIES**: When any authorized user creates a resource, does it meet company governance rules? (e.g. "Only deploy in South Africa North", "Require a tag for CostCenter").\n` +
        `- **Resource Locks**: Prevents accidental deletion (CanNotDelete) or modification (ReadOnly) of critical resources. Resource Locks take precedence over RBAC permissions!\n\n` +
        `**Analogy**: RBAC is the club bouncer checking your ID at the gate (authorization). Azure Policy is the dress code inside: even VIP guests with full access cannot enter wearing muddy flip-flops! A Resource Lock is placing the master keys in a locked glass case labeled "Emergency Only".`;
    }

    // IaaS vs PaaS vs SaaS
    if (text.includes('iaas') || text.includes('paas') || text.includes('saas') || text.includes('street food')) {
      return `${greetingPrefix}**IaaS vs. PaaS vs. SaaS (Cloud Service Models)**:\n\n` +
        `1. **IaaS (Infrastructure as a Service)**: Maximum flexibility and control. Microsoft provides virtual hardware; you install and manage the operating system, middleware, and software (e.g. Azure Virtual Machines).\n` +
        `2. **PaaS (Platform as a Service)**: Focus on building applications without server management. Microsoft handles OS patching, hardware scaling, and runtime (e.g. Azure App Service, Azure SQL Database).\n` +
        `3. **SaaS (Software as a Service)**: Fully managed end-user application consumed over the internet (e.g. Microsoft 365, OneDrive).\n\n` +
        `**Street Food / Nyama Choma Analogy**:\n` +
        `- IaaS is buying raw meat, charcoal, and salt to roast your own nyama choma at home (full control, all work).\n` +
        `- PaaS is going to a butchery where the chef lights the grill and handles the heat, and you just bring your marinated recipe to cook (platform provided).\n` +
        `- SaaS is sitting in a restaurant where food is cooked, plated, and served directly to you (ready to consume).`;
    }

    // Blob Storage & Access Tiers
    if (text.includes('blob') || text.includes('storage') || text.includes('tier') || text.includes('hot') || text.includes('cool') || text.includes('archive')) {
      return `${greetingPrefix}**Azure Blob Storage & Access Tiers**:\n\n` +
        `- **Hot Tier**: High storage cost, lowest access cost. For data accessed frequently (e.g. active daily web photos, application media).\n` +
        `- **Cool Tier**: Lower storage cost, higher access fee. For data stored for at least 30 days (e.g. monthly billing invoices).\n` +
        `- **Cold Tier**: Even lower storage cost, higher access fee. Stored for at least 90 days.\n` +
        `- **Archive Tier**: Lowest storage cost, highest access fee. For data stored for at least 180 days with hours of retrieval latency (e.g. legal records, regulatory archives).\n\n` +
        `**Mobile Money Analogy**: Hot tier is cash in your M-Pesa wallet ready to spend. Cool tier is savings in your bank account. Archive tier is a plot of land inherited upcountry: virtually zero daily cost to hold, but takes hours or days to liquidate when you need money!\n\n` +
        `**Exam Watch**: Data in the Archive tier is OFFLINE and must be "rehydrated" before reading!`;
    }

    // Microsoft Entra ID & Zero Trust
    if (text.includes('entra') || text.includes('active directory') || text.includes('mfa') || text.includes('zero trust') || text.includes('conditional access') || text.includes('identity')) {
      return `${greetingPrefix}**Microsoft Entra ID & Zero Trust Architecture**:\n\n` +
        `- **Microsoft Entra ID**: Cloud-based identity and access management service. Manages user sign-in and authentication across the Azure Portal, Microsoft 365, and third-party SaaS applications.\n` +
        `- **Authentication (AuthN) vs. Authorization (AuthZ)**: Authentication proves WHO you are (e.g. password + SMS/Authenticator code). Authorization determines WHAT actions you are allowed to perform (e.g. RBAC roles).\n` +
        `- **Conditional Access**: Automated security policies ("If employee logs in from an untrusted country or device, enforce MFA").\n` +
        `- **Zero Trust Model**: "Never trust, always verify." Assume breach, verify explicitly, and use least-privileged access.\n\n` +
        `**Analogy**: Authentication is showing your National ID card or passport at the bank counter (proves who you are). Authorization is the teller checking your bank account balance to verify if you are allowed to withdraw \$500.`;
    }

    // Cloud Benefits: HA, Scalability, Elasticity, Agility
    if (text.includes('high availability') || text.includes('scalability') || text.includes('elasticity') || text.includes('agility') || text.includes('disaster recovery') || text.includes('benefit')) {
      return `${greetingPrefix}**Core Cloud Architecture Benefits**:\n\n` +
        `- **High Availability (HA)**: Ensuring services remain operational with minimal downtime, backed by Microsoft Service Level Agreements (SLAs).\n` +
        `- **Vertical Scalability (Scale Up/Down)**: Increasing or decreasing the power of an existing resource (e.g. upgrading a VM from 4 vCPUs to 16 vCPUs).\n` +
        `- **Horizontal Scalability (Scale Out/In)**: Adding or removing instances of resources (e.g. running 5 VMs instead of 2 behind a load balancer).\n` +
        `- **Elasticity**: The ability of a system to automatically scale out during traffic spikes and scale back in when demand subsides.\n` +
        `- **Agility**: Speed of deploying new environments and features in minutes rather than waiting months for hardware procurement.\n\n` +
        `**Analogy**: High Availability is having dual SIM cards on different networks. Elasticity is M-Pesa or Flutterwave automatically provisioning 10x compute instances during Black Friday shopping and scaling back down at midnight.`;
    }

    // Networking: VNets, VPN Gateway, ExpressRoute
    if (text.includes('vnet') || text.includes('virtual network') || text.includes('vpn') || text.includes('expressroute') || text.includes('nsg') || text.includes('subnet')) {
      return `${greetingPrefix}**Azure Networking Services**:\n\n` +
        `- **Azure Virtual Network (VNet)**: The fundamental building block for private networks in Azure, enabling secure communication between VMs, internet, and on-premise networks.\n` +
        `- **Subnets**: IP partitions of a VNet (e.g. public frontend subnet, private database subnet).\n` +
        `- **Network Security Groups (NSGs)**: Virtual firewall rules that filter inbound and outbound network traffic based on source/destination IP, port, and protocol.\n` +
        `- **Azure VPN Gateway**: Sends encrypted traffic between an Azure Virtual Network and an on-premises location across the public internet.\n` +
        `- **Azure ExpressRoute**: Creates private, dedicated fiber connections between on-premises datacenters and Azure that DO NOT traverse the public internet (higher speed, ultra-low latency).\n\n` +
        `**Analogy**: VPN Gateway is driving an armored cash truck down the public highway (encrypted, but shares public roads). ExpressRoute is building a private dedicated railway track exclusively for your company!`;
    }

    // Cost Management & Tools: Pricing Calculator vs TCO vs Cost Management
    if (text.includes('cost') || text.includes('pricing calculator') || text.includes('tco') || text.includes('budget') || text.includes('advisor')) {
      return `${greetingPrefix}**Azure Cost Management & Pricing Estimator Tools**:\n\n` +
        `- **Azure Pricing Calculator**: Estimates expected monthly costs for Azure services BEFORE you deploy them.\n` +
        `- **Total Cost of Ownership (TCO) Calculator**: Compares the financial cost of running workloads on-premises versus migrating to Microsoft Azure over a multi-year horizon.\n` +
        `- **Microsoft Cost Management**: Monitors, analyzes, and allocates existing Azure cloud spend. Set automated spending budgets and alert notifications when costs reach 80% or 100% of limits.\n\n` +
        `**Analogy**: Pricing Calculator is planning a market budget on paper before going shopping. Cost Management is your mobile banking app sending an SMS alert whenever your weekly grocery budget exceeds your set limit.`;
    }

    // Monitoring: Azure Monitor vs Azure Service Health
    if (text.includes('monitor') || text.includes('service health') || text.includes('application insights') || text.includes('log analytics')) {
      return `${greetingPrefix}**Azure Monitor vs. Azure Service Health**:\n\n` +
        `- **Azure Monitor**: Collects and analyzes telemetry and performance metrics from YOUR applications and virtual infrastructure (CPU usage, logs, Application Insights).\n` +
        `- **Azure Service Health**: Personalized dashboard notifying you about MICROSOFT'S global cloud infrastructure health (regional outages, planned maintenance, and service advisories affecting your subscriptions).\n\n` +
        `**Analogy**: Azure Monitor is the dashboard gauges on your vehicle showing engine RPM and fuel level. Azure Service Health is a live traffic radio station announcing that the main expressway bridge is temporarily flooded ahead.`;
    }

    // Match structured notes
    const matchedNote = AZ900_STRUCTURED_NOTES.find(
      n => text.includes(n.title.toLowerCase()) || text.includes(n.outline_skill.toLowerCase())
    );
    if (matchedNote) {
      return `${greetingPrefix}**${matchedNote.title}** (${matchedNote.domain_name}):\n\n` +
        `${matchedNote.official_summary}\n\n` +
        `**Core Architectural Principles**:\n` +
        `${matchedNote.core_principles.slice(0, 3).map(p => `- ${p.replace(/\*\*/g, '')}`).join('\n')}\n\n` +
        `**African Analogy**: "${matchedNote.african_analogy}"\n\n` +
        `**Exam Watch**: ${matchedNote.exam_watch[0]}`;
    }

    // Match syllabus topics
    const matchedTopic = TOPICS.find(t =>
      t.title.toLowerCase().includes(text) ||
      t.slug.toLowerCase().includes(text) ||
      text.includes(t.title.toLowerCase().split(' ')[0])
    );
    if (matchedTopic) {
      const relatedCard = SEED_FLASHCARDS.find(c => c.topic_id === matchedTopic.id);
      return `${greetingPrefix}**${matchedTopic.title}** (${matchedTopic.outline_skill}):\n\n` +
        `${relatedCard?.back || matchedTopic.summary}\n\n` +
        `${relatedCard?.african_analogy ? `**Analogy**: "${relatedCard.african_analogy}"\n\n` : ''}` +
        `**AZ-900 Exam Tip**: Ensure you know how Microsoft defines this service and which tier or model applies.`;
    }

    // Default grounded in-scope overview
    return `${greetingPrefix}In Microsoft Azure Fundamentals (AZ-900), remember the 3 foundational domains:\n\n` +
      `1. **Describe Cloud Concepts (25-30%)**: Cloud models (IaaS/PaaS/SaaS), Shared Responsibility, CapEx vs. OpEx, and cloud benefits (High Availability, Scalability, Elasticity, Agility).\n` +
      `2. **Describe Azure Architecture and Services (35-40%)**: Regions, Availability Zones, Resource Groups, Subscriptions, Compute (VMs, Functions, Containers), Storage (Blob, Files, Tiers), and Networking (VNet, VPN, ExpressRoute).\n` +
      `3. **Describe Azure Management and Governance (30-35%)**: Azure Policy, RBAC, Resource Locks, Cost Management, Pricing Calculator, Azure Monitor, and Service Health.\n\n` +
      `Ask me any question about these services, or choose one of the prompt chips below!`;
  }
}


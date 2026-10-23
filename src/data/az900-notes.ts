export interface CheckpointQuestion {
  stem: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface AZ900NoteTopic {
  id: string;
  domain_id: 'dom-1' | 'dom-2' | 'dom-3';
  domain_name: string;
  title: string;
  order_index: number;
  read_time_minutes: number;
  microsoft_source_url: string;
  outline_skill: string;
  official_summary: string;
  core_principles: string[];
  african_analogy: string;
  exam_watch: string[];
  checkpoint: CheckpointQuestion;
  xp_reward: number;
}

export const AZ900_STRUCTURED_NOTES: AZ900NoteTopic[] = [
  // ============================================================
  // DOMAIN 1: Describe cloud concepts (25-30%)
  // ============================================================
  {
    id: 'note-cloud-computing',
    domain_id: 'dom-1',
    domain_name: 'Describe cloud concepts',
    title: 'Cloud Computing & The Shared Responsibility Model',
    order_index: 1,
    read_time_minutes: 4,
    microsoft_source_url: 'https://learn.microsoft.com/azure/fundamentals/what-is-cloud-computing',
    outline_skill: 'describe-cloud-computing',
    official_summary:
      'Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.',
    core_principles: [
      '**On-Demand Self-Service**: Provision compute, storage, and networking instantaneously via the Azure Portal, CLI, or ARM/Bicep templates without human intervention from Microsoft.',
      '**Broad Network Access**: Services are accessible worldwide over standard internet protocols from laptops, mobile devices, or dedicated connections.',
      '**Resource Pooling**: Microsoft pools physical infrastructure to serve multi-tenant customers dynamically, securely isolating workloads via hypervisors.',
      '**Rapid Elasticity**: Workloads can scale dynamically up/down or out/in to match demand surges without paying for idle capacity.',
      '**Measured Service (Consumption-Based)**: You only pay for what you consume (per minute or per second billing), shifting costs from CapEx to OpEx.',
      '**Shared Responsibility Model**: Security is a shared partnership between Microsoft and the customer. In IaaS, PaaS, and SaaS, the CUSTOMER is ALWAYS 100% responsible for Data, Identities, and Devices.'
    ],
    african_analogy:
      'Renting an office in Nairobi or Lagos: The landlord (Microsoft) maintains the building foundations, exterior walls, water pipes, and security perimeter (Datacenter facilities). YOU (the tenant) are always responsible for who you give keys to, locking your safe, and protecting your company confidential files (Identities & Data).',
    exam_watch: [
      'Microsoft tests who is responsible for data in SaaS (e.g., Microsoft 365). Answer: The customer is ALWAYS responsible for data and user access!',
      'In On-Premises, the customer is responsible for all 100% of the stack, including physical hardware and electricity.'
    ],
    checkpoint: {
      stem: 'Under Microsoft Azure\'s Shared Responsibility Model, which responsibility is ALWAYS retained by the customer across all cloud models (IaaS, PaaS, and SaaS)?',
      options: [
        'Physical datacenter security and environmental cooling',
        'Information and data stored within the applications',
        'Physical server hardware replacement and maintenance',
        'Operating system kernel patching and hypervisor configuration'
      ],
      correct: 'Information and data stored within the applications',
      explanation:
        'Correct! Under the Shared Responsibility Model, regardless of whether you use IaaS, PaaS, or SaaS, the customer ALWAYS retains responsibility for their data, information, endpoints (devices), and accounts/identities.'
    },
    xp_reward: 25
  },
  {
    id: 'note-cloud-models',
    domain_id: 'dom-1',
    domain_name: 'Describe cloud concepts',
    title: 'Cloud Deployment Models: Public, Private & Hybrid',
    order_index: 2,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/fundamentals/what-is-cloud-computing#types-of-cloud-computing',
    outline_skill: 'describe-cloud-models',
    official_summary:
      'Cloud models define where infrastructure is hosted, who owns it, and how resources are shared: Public Cloud, Private Cloud, Hybrid Cloud, and Multi-Cloud.',
    core_principles: [
      '**Public Cloud**: Owned and operated by a third-party cloud provider (Microsoft). Delivers compute and storage over the internet. Multi-tenant architecture with zero hardware management for customers.',
      '**Private Cloud**: Dedicated exclusively to one organization. Can be hosted in an organization\'s on-premises datacenter or by a third-party host. Maximum control and data sovereignty, but requires capital expense (CapEx).',
      '**Hybrid Cloud**: Combines public cloud with on-premises private cloud infrastructure. Connected via Azure Arc, VPN Gateway, or Azure ExpressRoute. Allows sensitive financial data to stay on-prem while bursting workloads to public cloud.',
      '**Multi-Cloud**: Utilizing services from multiple public cloud providers (e.g. Azure + AWS) to avoid vendor lock-in or leverage specific specialized services.'
    ],
    african_analogy:
      'Public transport (Matatu / Danfo) is Public Cloud—anyone buys a ticket and rides together efficiently. Buying your own private Mercedes is Private Cloud—costly, you pay for all maintenance, but you have complete privacy. Owning your car for daily home runs while booking a flight for long-distance travel is Hybrid Cloud.',
    exam_watch: [
      'Microsoft tests: "Which cloud model provides the greatest agility and requires no capital expenditure?" Answer: Public Cloud.',
      'Azure Arc enables management of on-premises, multi-cloud, and edge servers right from the Azure Control Plane.'
    ],
    checkpoint: {
      stem: 'A commercial bank in Kigali must maintain client transactional ledgers on dedicated on-premises servers for local compliance, but wants to run its mobile app web frontends on Azure. Which cloud deployment model describes this setup?',
      options: [
        'Private Cloud',
        'Hybrid Cloud',
        'Public Cloud only',
        'Community Cloud'
      ],
      correct: 'Hybrid Cloud',
      explanation:
        'Correct! Hybrid Cloud connects private on-premises infrastructure with public cloud resources, allowing data-sensitive databases to reside locally while scalable web services run on Azure.'
    },
    xp_reward: 25
  },
  {
    id: 'note-capex-opex',
    domain_id: 'dom-1',
    domain_name: 'Describe cloud concepts',
    title: 'Cloud Economics: CapEx vs. OpEx & Pricing Models',
    order_index: 3,
    read_time_minutes: 4,
    microsoft_source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-concepts-pricing-models',
    outline_skill: 'describe-consumption-based-model',
    official_summary:
      'Cloud computing shifts traditional IT financial models from heavy upfront Capital Expenditures (CapEx) to flexible, predictable Operational Expenditures (OpEx) driven by consumption-based pricing.',
    core_principles: [
      '**CapEx (Capital Expenditure)**: Upfront money spent on physical infrastructure (buying racks, servers, air conditioners, generator backups). The value of the asset depreciates over time on company tax books.',
      '**OpEx (Operational Expenditure)**: Ongoing operational costs for services and products consumed on demand (pay-as-you-go). Deducted from taxes in the same billing cycle with zero upfront hardware cost.',
      '**Consumption-Based Model**: Azure charges only for the exact compute seconds, gigabytes stored, or network egress transferred. No minimum commitments unless using Reserved Instances.'
    ],
    african_analogy:
      'CapEx is buying a commercial diesel generator in cash to power your market stall. OpEx is buying daily prepaid electricity tokens (tokens za stima) from your phone—you only pay for the exact kilowatt-hours you consume.',
    exam_watch: [
      'Exam question: "What is an advantage of moving to an OpEx model?" Answer: Ability to scale costs directly with business demand without upfront hardware risk.'
    ],
    checkpoint: {
      stem: 'Which benefit is achieved by transitioning enterprise IT infrastructure from a CapEx model to an OpEx model via Microsoft Azure?',
      options: [
        'Purchasing server hardware at wholesale bulk rates',
        'Eliminating all software licensing obligations permanently',
        'Removing upfront capital costs and paying for services based on consumption',
        'Guaranteeing 100% uptime with zero need for disaster recovery planning'
      ],
      correct: 'Removing upfront capital costs and paying for services based on consumption',
      explanation:
        'Correct! Shifting from CapEx to OpEx eliminates large upfront datacenter expenditures, allowing companies to pay dynamically for computing services as operating expenses.'
    },
    xp_reward: 25
  },
  {
    id: 'note-cloud-benefits',
    domain_id: 'dom-1',
    domain_name: 'Describe cloud concepts',
    title: 'Cloud Architecture Benefits: HA, Scalability & Elasticity',
    order_index: 4,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-computing-benefits',
    outline_skill: 'describe-cloud-benefits',
    official_summary:
      'Core architectural advantages of the cloud: High Availability, Scalability, Elasticity, Agility, Reliability, and Disaster Recovery.',
    core_principles: [
      '**High Availability (HA)**: Ensuring services remain accessible with minimal downtime regardless of hardware failures, backed by Microsoft Service Level Agreements (SLAs).',
      '**Vertical Scalability (Scaling Up/Down)**: Increasing or decreasing the compute capacity of an existing resource (e.g. upgrading a VM from 4 vCPUs to 16 vCPUs).',
      '**Horizontal Scalability (Scaling Out/In)**: Adding or removing instances of resources (e.g. adding 5 extra VM instances behind an Azure Load Balancer).',
      '**Elasticity**: The ability to dynamically and automatically scale out during traffic spikes and scale in when demand subsides (e.g. Virtual Machine Scale Sets).',
      '**Agility**: Speed of deploying new features, global applications, and environments in minutes rather than waiting months for server procurement.',
      '**Disaster Recovery (DR)**: Keeping data safe and services restorable across distant geographic regions in the event of catastrophic regional outages.'
    ],
    african_analogy:
      'High Availability is having dual SIM cards on different telco networks in your phone. Elasticity is M-Pesa or Flutterwave automatically provisioning 10x compute capacity during Black Friday shopping and scaling back down at midnight.',
    exam_watch: [
      'Crucial distinction: "Scaling Up" = bigger VM size. "Scaling Out" = adding more VM instances.',
      'Elasticity is automatic; scalability is the capacity capability.'
    ],
    checkpoint: {
      stem: 'An e-commerce startup experiences sudden traffic spikes every evening between 7 PM and 9 PM. Which cloud feature automatically adds and removes virtual machines to match this fluctuating demand?',
      options: [
        'Geo-redundancy',
        'Elasticity',
        'Vertical scaling only',
        'Fault tolerance'
      ],
      correct: 'Elasticity',
      explanation:
        'Correct! Elasticity is the ability of cloud systems to automatically dynamically scale out resources during demand surges and scale back in when traffic normalizes.'
    },
    xp_reward: 25
  },

  // ============================================================
  // DOMAIN 2: Describe Azure architecture and services (35-40%)
  // ============================================================
  {
    id: 'note-regions-and-zones',
    domain_id: 'dom-2',
    domain_name: 'Describe Azure architecture and services',
    title: 'Azure Global Infrastructure: Regions & Availability Zones',
    order_index: 5,
    read_time_minutes: 6,
    microsoft_source_url: 'https://learn.microsoft.com/azure/reliability/availability-zones-overview',
    outline_skill: 'describe-azure-regions-and-availability-zones',
    official_summary:
      'Microsoft Azure operates one of the world\'s largest global networks, organized systematically into Geographies, Regions, Availability Zones, and Region Pairs.',
    core_principles: [
      '**Azure Region**: A geographical area containing one or more physical datacenters connected via dedicated, latency-defined fiber networks (e.g., South Africa North in Johannesburg, South Africa West in Cape Town).',
      '**Availability Zones (AZs)**: Physically separate datacenters within the SAME Azure region. Each zone has independent power, cooling, and networking infrastructure. Minimum of 3 zones per supported region.',
      '**Region Pairs**: Each Azure region is paired with another region within the same geography (at least 300 miles apart) to ensure business continuity. Azure coordinates platform updates so only one region in a pair is updated at a time.',
      '**Sovereign Regions**: Dedicated physical networks isolated for specific government compliance (Azure Government for US Federal/State agencies, Azure China 21Vianet).'
    ],
    african_analogy:
      'If you store your company goods in three separate warehouses across different suburbs in Johannesburg (Sandton, Midrand, Centurion) with separate power generators, an electrical blackout in one zone does not stop your shipments (Availability Zones). Storing backup stock in Cape Town protects you if an earthquake hits Gauteng (Region Pairs).',
    exam_watch: [
      'Availability Zones protect against DATACENTER failures.',
      'Region Pairs protect against REGIONAL/GEOGRAPHIC disasters.',
      'Not all Azure services support Availability Zones; services are classified as zonal, zone-redundant, or non-zonal.'
    ],
    checkpoint: {
      stem: 'What architectural level of protection do Azure Availability Zones provide against infrastructure disruption?',
      options: [
        'Protection against an entire continent-wide fiber cutoff',
        'Protection against individual physical datacenter power or cooling failures within a region',
        'Protection against accidental database table deletion by an administrator',
        'Protection against zero-day operating system kernel exploits'
      ],
      correct: 'Protection against individual physical datacenter power or cooling failures within a region',
      explanation:
        'Correct! Availability Zones are physically separate datacenters within the same region with independent cooling, power, and networking to withstand datacenter-level failures.'
    },
    xp_reward: 25
  },
  {
    id: 'note-management-hierarchy',
    domain_id: 'dom-2',
    domain_name: 'Describe Azure architecture and services',
    title: 'Azure Resource Management Hierarchy & ARM',
    order_index: 6,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/overview',
    outline_skill: 'describe-azure-resource-hierarchy',
    official_summary:
      'Azure organizes governance and resource lifecycle management through a strict 4-level structural hierarchy: Management Groups, Subscriptions, Resource Groups, and Resources.',
    core_principles: [
      '**Management Groups**: Containers for managing access, policy, and compliance across multiple subscriptions. Policies applied at root inherit downwards.',
      '**Subscriptions**: Logical unit of management, billing, and resource containment. Each subscription links to an Azure account and generates a separate invoice.',
      '**Resource Groups**: Logical containers where related Azure resources (VMs, VNets, Storage) are deployed and managed together. Resources can only exist in ONE resource group at a time, but can interact across resource groups.',
      '**Azure Resource Manager (ARM)**: The unified deployment and management layer. Whether you deploy via Azure Portal, PowerShell, Azure CLI, or REST APIs, all requests go through ARM for validation, authentication, and auditing.'
    ],
    african_analogy:
      'Think of an African Pan-African conglomerate (e.g. Dangote Group or Safaricom PLC): The Board is the Management Group. The country subsidiaries (Kenya, Nigeria, Ghana) are Subscriptions with individual billing accounts. Each branch store is a Resource Group containing shelves, cash registers, and stock (Resources).',
    exam_watch: [
      'If you delete a Resource Group, ALL resources inside it are deleted simultaneously!',
      'Resource groups can hold resources located in different geographic regions.',
      'ARM templates are declarative JSON or Bicep files that ensure consistent infrastructure-as-code.'
    ],
    checkpoint: {
      stem: 'Which statement accurately describes the relationship between Azure Resources and Resource Groups?',
      options: [
        'A single resource can belong to up to three different resource groups simultaneously',
        'Deleting a resource group leaves all child resources active in an unassigned pool',
        'A resource can exist in only one resource group at a time',
        'Resources inside a resource group must all be deployed in the same geographical region'
      ],
      correct: 'A resource can exist in only one resource group at a time',
      explanation:
        'Correct! In Azure, each resource can belong to only one resource group at any given time, although resources can be moved between resource groups.'
    },
    xp_reward: 25
  },
  {
    id: 'note-compute-services',
    domain_id: 'dom-2',
    domain_name: 'Describe Azure architecture and services',
    title: 'Azure Compute: VMs, Containers, App Services & Functions',
    order_index: 7,
    read_time_minutes: 6,
    microsoft_source_url: 'https://learn.microsoft.com/azure/architecture/guide/technology-choices/compute-overview',
    outline_skill: 'describe-azure-compute-services',
    official_summary:
      'Azure compute provides on-demand computing power ranging from raw Infrastructure-as-a-Service virtual machines to managed containers, web application platforms, and event-driven serverless functions.',
    core_principles: [
      '**Azure Virtual Machines (IaaS)**: Complete control over the operating system (Windows or Linux). You configure software, networking, and OS patching.',
      '**Virtual Machine Scale Sets (VMSS)**: Manage and configure a group of identical, load-balanced VMs that automatically scale in and out based on CPU usage or schedules.',
      '**Azure App Service (PaaS)**: Fully managed platform for building, deploying, and scaling enterprise web apps and REST APIs without managing web server infrastructure.',
      '**Azure Container Instances (ACI)**: Fastest and simplest way to run a container in Azure without managing any virtual servers or container orchestrators.',
      '**Azure Kubernetes Service (AKS)**: Production-grade managed container orchestration for managing clusters of thousands of containers with automated healing and scaling.',
      '**Azure Functions (Serverless)**: Event-driven code execution where you only run code in response to triggers (e.g., HTTP request, queue message, timer). Zero server management; pay only for execution time.'
    ],
    african_analogy:
      'VM is renting an empty plot of land and building your house from bricks (full control). App Service is moving into a fully furnished apartment. Azure Functions is hailing an Uber—you don\'t own the car, you only pay for the exact trip taken.',
    exam_watch: [
      'Serverless computing eliminates server management and runs purely on events.',
      'ACI is for individual single containers; AKS is for complex multi-container orchestration.'
    ],
    checkpoint: {
      stem: 'An engineering team wants to execute Python code automatically whenever a new image file is uploaded to an Azure Storage account, with zero server infrastructure provisioning. Which Azure compute service should they choose?',
      options: [
        'Azure Virtual Machines',
        'Azure Functions',
        'Azure Virtual Desktop',
        'Virtual Machine Scale Sets'
      ],
      correct: 'Azure Functions',
      explanation:
        'Correct! Azure Functions is a serverless, event-driven compute service that executes code in response to events (such as blob uploads) without managing any underlying servers.'
    },
    xp_reward: 25
  },
  {
    id: 'note-storage-services',
    domain_id: 'dom-2',
    domain_name: 'Describe Azure architecture and services',
    title: 'Azure Storage: Blob, Files, Disks & Access Tiers',
    order_index: 8,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/storage/common/storage-introduction',
    outline_skill: 'describe-azure-storage-services',
    official_summary:
      'Azure Storage provides highly available, secure, scalable, and massively redundant storage for data objects, files, disks, and unstructured data.',
    core_principles: [
      '**Azure Blob Storage**: Object storage for unstructured data (text files, videos, backups, medical scans). Highly scalable with massive global throughput.',
      '**Azure Files**: Fully managed cloud file shares accessible via standard Server Message Block (SMB) or Network File System (NFS) protocols. Seamlessly mounts as network drives on Windows, Linux, and macOS.',
      '**Azure Disks**: Block-level virtual hard disks attached to Azure Virtual Machines (Ultra Disk, Premium SSD, Standard SSD, Standard HDD).',
      '**Blob Access Tiers**:',
      '  - **Hot Tier**: Optimized for frequently accessed data. Highest storage cost, lowest access cost.',
      '  - **Cool Tier**: Optimized for infrequently accessed data stored for at least 30 days (e.g. monthly reports).',
      '  - **Cold Tier**: Optimized for infrequently accessed data stored for at least 90 days.',
      '  - **Archive Tier**: Lowest storage cost, highest access fee. Stored for at least 180 days; data is offline and takes hours to rehydrate.',
      '**Storage Redundancy**:',
      '  - **LRS (Locally Redundant Storage)**: 3 copies within a single datacenter.',
      '  - **ZRS (Zone-Redundant Storage)**: Replicated across 3 Availability Zones within the same region.',
      '  - **GRS (Geo-Redundant Storage)**: Replicated to a secondary paired region hundreds of miles away.'
    ],
    african_analogy:
      'Hot tier is cash in your mobile money wallet (ready to spend). Cool tier is savings in your bank account. Archive tier is buying a plot of land upcountry: minimal daily maintenance cost, but takes days to liquidate when you need cash!',
    exam_watch: [
      'Exam question on Archive Tier: Remember that data in the Archive tier is OFFLINE and must be "rehydrated" before reading, taking up to several hours!',
      'Azure Files uses the industry-standard SMB protocol for legacy app migration.'
    ],
    checkpoint: {
      stem: 'A healthcare clinic must store historical patient X-rays for 10 years to meet regulatory compliance. The files are rarely ever inspected after the first month. Which Azure Blob storage tier provides the most cost-effective storage?',
      options: [
        'Hot Tier',
        'Cool Tier',
        'Archive Tier',
        'Premium Tier'
      ],
      correct: 'Archive Tier',
      explanation:
        'Correct! The Archive tier offers the lowest storage cost per gigabyte for long-term retention of rarely accessed data that can tolerate retrieval latency.'
    },
    xp_reward: 25
  },
  {
    id: 'note-networking-services',
    domain_id: 'dom-2',
    domain_name: 'Describe Azure architecture and services',
    title: 'Azure Networking: VNets, Subnets, Gateways & ExpressRoute',
    order_index: 9,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview',
    outline_skill: 'describe-azure-networking-services',
    official_summary:
      'Azure networking enables secure communication between cloud resources, on-premises datacenters, and the public internet.',
    core_principles: [
      '**Azure Virtual Network (VNet)**: The fundamental building block for your private network in Azure. Enables VMs to securely communicate with each other, the internet, and on-premises networks.',
      '**Subnets**: Segments of a VNet\'s IP address range. Allows partitioning of resources into logical subnets (e.g. public frontend subnet, private database subnet).',
      '**Network Security Groups (NSGs)**: Virtual firewall rules that filter inbound and outbound network traffic based on source/destination IP address, port, and protocol.',
      '**Azure VPN Gateway**: Sends encrypted traffic between an Azure Virtual Network and an on-premises location across the public internet.',
      '**Azure ExpressRoute**: Creates private, dedicated fiber-optic connections between on-premises datacenters and Azure that do NOT traverse the public internet. Offers greater reliability, faster speeds, and lower latency.'
    ],
    african_analogy:
      'A VPN Gateway is driving a secure cash-in-transit armored car down the public highway between Nairobi and Mombasa (encrypted, but travels on public roads). ExpressRoute is building a private dedicated railway track exclusively for your company—faster, dedicated, and never shares road traffic with the public.',
    exam_watch: [
      'Remember: ExpressRoute connections do NOT travel over the public internet!',
      'VPN Gateway traffic is encrypted and travels over the public internet.'
    ],
    checkpoint: {
      stem: 'A financial exchange requires high-speed, private network connectivity between their primary on-premises datacenter in Lagos and Azure, with zero traffic traversing the public internet. Which service should they implement?',
      options: [
        'Point-to-Site VPN',
        'Azure ExpressRoute',
        'Virtual Network Peering',
        'Azure Network Security Groups'
      ],
      correct: 'Azure ExpressRoute',
      explanation:
        'Correct! Azure ExpressRoute connects on-premises networks directly to Azure through a private connection facilitated by a connectivity provider, bypassing the public internet.'
    },
    xp_reward: 25
  },
  {
    id: 'note-identity-and-security',
    domain_id: 'dom-2',
    domain_name: 'Describe Azure architecture and services',
    title: 'Identity & Access: Microsoft Entra ID & Zero Trust',
    order_index: 10,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/entra/fundamentals/whatis',
    outline_skill: 'describe-azure-identity-access-security',
    official_summary:
      'Identity is the new primary security perimeter in modern cloud architecture. Microsoft Entra ID (formerly Azure Active Directory) provides centralized identity and access management.',
    core_principles: [
      '**Microsoft Entra ID**: Cloud-based identity and access management service. Manages user sign-in and authorization for internal resources (Azure Portal) and external SaaS apps (Microsoft 365).',
      '**Authentication (AuthN) vs. Authorization (AuthZ)**: Authentication proves WHO you are (e.g. entering password + SMS code). Authorization determines WHAT you are permitted to do (e.g. can you delete a database?).',
      '**Multifactor Authentication (MFA)**: Requires two or more verification factors: something you know (password), something you have (phone/authenticator app), or something you are (fingerprint/biometrics).',
      '**Conditional Access**: Evaluates identity signals (user location, device health, risk score) using automated policies before granting access ("If user is logging in outside Africa, require MFA").',
      '**Zero Trust Model**: "Never trust, always verify." Every access request is fully authenticated, authorized, and encrypted before access is granted.'
    ],
    african_analogy:
      'Authentication is showing your National ID card or Passport at the bank counter (proves who you are). Authorization is the teller checking your bank balance to see if you have enough funds to withdraw \$500 (what you are allowed to do).',
    exam_watch: [
      'Exam question: "Which feature enforces MFA only when users sign in from an untrusted country or anonymous IP?" Answer: Conditional Access!',
      'Remember that Microsoft Entra ID is a cloud identity service, not traditional on-prem Windows Server AD.'
    ],
    checkpoint: {
      stem: 'Which security principle best describes the core methodology of the Zero Trust security model?',
      options: [
        'Trust any device connected inside the corporate office LAN',
        'Never trust, always verify every access request regardless of origin',
        'Rely entirely on perimeter perimeter firewalls to stop attackers',
        'Allow administrators full unrestricted access without MFA'
      ],
      correct: 'Never trust, always verify every access request regardless of origin',
      explanation:
        'Correct! The foundational guiding principle of the Zero Trust model is "Never trust, always verify", treating every transaction and connection as if it originated from an open network.'
    },
    xp_reward: 25
  },

  // ============================================================
  // DOMAIN 3: Describe Azure management and governance (30-35%)
  // ============================================================
  {
    id: 'note-cost-management',
    domain_id: 'dom-3',
    domain_name: 'Describe Azure management and governance',
    title: 'Azure Cost Management & Pricing Estimator Tools',
    order_index: 11,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/cost-management-billing/cost-management-billing-overview',
    outline_skill: 'describe-azure-cost-management',
    official_summary:
      'Microsoft provides specialized financial tools to predict, track, allocate, and optimize cloud expenses before and after deployment.',
    core_principles: [
      '**Azure Pricing Calculator**: Estimates expected monthly costs for Azure services BEFORE you deploy them. Configure VM sizes, regions, storage tiers, and network usage to get an accurate quote.',
      '**Total Cost of Ownership (TCO) Calculator**: Compares the estimated financial cost of running your datacenter on-premises versus migrating to Microsoft Azure over a multi-year horizon.',
      '**Microsoft Cost Management**: Monitors, analyzes, and allocates existing Azure cloud spend. Set automated spending budgets and alert notifications when costs reach 80% or 100% of limits.',
      '**Cost Optimization Best Practices**: Use Azure Reservations (1-year or 3-year commitments for up to 72% discounts), Azure Hybrid Benefit (use existing Windows Server/SQL licenses), and auto-shutdown on dev VMs.'
    ],
    african_analogy:
      'Pricing Calculator is planning a market budget on paper before going shopping. Cost Management is your mobile banking app sending an SMS alert whenever your weekly grocery budget exceeds your set limit.',
    exam_watch: [
      'TCO Calculator compares On-Premises costs to Cloud costs.',
      'Pricing Calculator estimates costs for new Azure workloads.',
      'Cost Management monitors existing deployed Azure spending.'
    ],
    checkpoint: {
      stem: 'A chief technology officer wants to estimate the total operational and capital cost savings of retiring their on-premises server room and migrating workloads to Azure over a 5-year timeline. Which tool should they utilize?',
      options: [
        'Azure Pricing Calculator',
        'Total Cost of Ownership (TCO) Calculator',
        'Azure Cost Management budgets',
        'Azure Advisor recommendation blade'
      ],
      correct: 'Total Cost of Ownership (TCO) Calculator',
      explanation:
        'Correct! The Total Cost of Ownership (TCO) Calculator is designed specifically to compare the cost of running on-premises datacenter infrastructure against migrating to Microsoft Azure.'
    },
    xp_reward: 25
  },
  {
    id: 'note-governance-and-policy',
    domain_id: 'dom-3',
    domain_name: 'Describe Azure management and governance',
    title: 'Governance & Compliance: Azure Policy, RBAC & Resource Locks',
    order_index: 12,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/governance/policy/overview',
    outline_skill: 'describe-azure-governance-tools',
    official_summary:
      'Azure provides programmatic governance enforcement to maintain compliance, prevent accidental resource destruction, and control administrative authorization.',
    core_principles: [
      '**Azure Policy**: Enforces organizational rules and governance standards across all resource deployments. For example: "Only permit VM deployment in South Africa North", "Require tag: CostCenter", or "Block creation of G-series VMs".',
      '**Role-Based Access Control (RBAC)**: Fine-grained access management that controls WHO can perform WHAT actions on Azure resources (Owner, Contributor, Reader).',
      '**Difference Between Policy & RBAC**: RBAC controls WHO has access; Azure Policy enforces WHAT resource properties are allowed, regardless of the user\'s RBAC permissions.',
      '**Azure Resource Locks**: Prevents accidental modification or deletion of critical production resources. Two lock types:',
      '  - **CanNotDelete (Delete lock)**: Authorized users can still read and modify the resource, but CANNOT delete it.',
      '  - **ReadOnly**: Authorized users can only view the resource, but CANNOT modify or delete it.'
    ],
    african_analogy:
      'RBAC is the bouncer checking VIP badges at the front gate (authorization). Azure Policy is the venue dress code—even if you are a VIP with full access, you cannot enter wearing flip-flops! A Resource Lock is placing the master keys in a locked glass case labeled "Emergency Only".',
    exam_watch: [
      'Resource Locks take precedence over RBAC permissions! Even an Owner cannot delete a locked resource until the lock is removed.',
      'Policies and Locks inherit automatically from parent scopes (Management Group -> Subscription -> Resource Group -> Resource).'
    ],
    checkpoint: {
      stem: 'An Azure administrator needs to ensure that team members cannot accidentally delete a mission-critical production SQL database, while still permitting them to update database tables and configurations. What should be applied?',
      options: [
        'An Azure Policy blocking SQL read actions',
        'A ReadOnly Resource Lock on the SQL database',
        'A CanNotDelete Resource Lock on the SQL database',
        'Revoking all user RBAC roles completely'
      ],
      correct: 'A CanNotDelete Resource Lock on the SQL database',
      explanation:
        'Correct! A CanNotDelete (Delete) lock allows authorized users to read and modify resource configurations, but prevents anyone from deleting the resource until the lock is lifted.'
    },
    xp_reward: 25
  },
  {
    id: 'note-monitoring-and-health',
    domain_id: 'dom-3',
    domain_name: 'Describe Azure management and governance',
    title: 'Monitoring & Health: Azure Monitor & Service Health',
    order_index: 13,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/azure-monitor/overview',
    outline_skill: 'describe-azure-monitoring-tools',
    official_summary:
      'Azure provides continuous telemetry, diagnostics, and global infrastructure visibility through Azure Monitor and Azure Service Health.',
    core_principles: [
      '**Azure Monitor**: Comprehensive platform for collecting, analyzing, and acting on telemetry from Azure and on-premises environments.',
      '  - **Metrics**: Numerical values measuring system performance at specific time intervals (e.g., CPU percentage, memory usage, disk throughput).',
      '  - **Logs**: Text-based event records and trace data queried using Kusto Query Language (KQL) in Log Analytics.',
      '  - **Application Insights**: Feature of Azure Monitor that monitors live web application performance, exceptions, and user analytics.',
      '**Azure Service Health**: Personalized dashboard providing guidance on Microsoft infrastructure events:',
      '  - **Azure Status**: Global view of the health of all Azure services across all global regions.',
      '  - **Service Health**: Personalized view showing outages affecting YOUR specific subscriptions and resources.',
      '  - **Resource Health**: Diagnoses specific individual resource issues (e.g. why did VM-01 restart?).'
    ],
    african_analogy:
      'Azure Monitor is the dashboard gauges on your vehicle showing engine RPM and fuel level. Azure Service Health is a live traffic radio station announcing that the main expressway bridge is temporarily flooded ahead.',
    exam_watch: [
      'Remember the difference: Azure Monitor watches YOUR workloads; Azure Service Health reports on MICROSOFT\'S global cloud infrastructure health.'
    ],
    checkpoint: {
      stem: 'Which Azure monitoring tool provides a customized, personalized view of health disruptions and planned maintenance affecting the specific subscriptions and regions your organization uses?',
      options: [
        'Azure Status global public page',
        'Azure Service Health dashboard',
        'Azure Network Watcher',
        'Azure DevTest Labs'
      ],
      correct: 'Azure Service Health dashboard',
      explanation:
        'Correct! Azure Service Health provides a personalized alert dashboard notifying you of service outages, planned platform maintenance, and health advisories that directly impact your specific subscriptions and deployed resources.'
    },
    xp_reward: 25
  },
  {
    id: 'note-security-and-compliance',
    domain_id: 'dom-3',
    domain_name: 'Describe Azure management and governance',
    title: 'Cloud Security & Trust: Microsoft Defender for Cloud & Purview',
    order_index: 14,
    read_time_minutes: 5,
    microsoft_source_url: 'https://learn.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction',
    outline_skill: 'describe-azure-security-and-compliance',
    official_summary:
      'Enterprise cloud posture management, threat protection, and automated compliance assessment across multi-cloud environments.',
    core_principles: [
      '**Microsoft Defender for Cloud**: Cloud Security Posture Management (CSPM) and Cloud Workload Protection (CWPP). Assesses resources against security benchmarks, provides an overall Secure Score, and detects active security threats.',
      '**Secure Score**: Numerical percentage showing your current security posture against Microsoft security best practices. Implementing recommendations (like enabling MFA) directly increases your score.',
      '**Microsoft Purview**: Unified data governance and compliance solution. Discovers, classifies, and protects sensitive data across on-premises, multi-cloud, and SaaS platforms.',
      '**Azure Trust Center & Service Trust Portal**: Official Microsoft repositories providing independent third-party audit reports (ISO 27001, SOC 2, HIPAA, GDPR, PCI-DSS) demonstrating Microsoft\'s compliance with international regulatory standards.'
    ],
    african_analogy:
      'Microsoft Defender for Cloud is an expert security consultant walking through your office building, pointing out unlocked windows, and giving you an overall security safety score out of 100%.',
    exam_watch: [
      'Secure Score measures security posture. Higher score = lower risk.',
      'The Service Trust Portal is where compliance officers download official third-party audit reports.'
    ],
    checkpoint: {
      stem: 'Which tool provides an organization with a measurable percentage metric representing their overall cloud security posture, alongside actionable recommendations to remediate vulnerabilities?',
      options: [
        'Azure Service Health',
        'Microsoft Defender for Cloud Secure Score',
        'Azure Cost Management Advisor',
        'Total Cost of Ownership Calculator'
      ],
      correct: 'Microsoft Defender for Cloud Secure Score',
      explanation:
        'Correct! Microsoft Defender for Cloud calculates a Secure Score that summarizes your organization\'s security posture and outlines prioritized recommendations to strengthen defenses.'
    },
    xp_reward: 25
  }
];


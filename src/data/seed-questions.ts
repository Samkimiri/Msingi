import { Question } from '../types';

export const SEED_QUESTIONS: Question[] = [
  // ==========================================
  // DOMAIN 1: Describe cloud concepts (25-30%)
  // ==========================================

  // 1. define-cloud-computing
  {
    id: 'q-cloud-def-1',
    topic_id: 'top-cloud-def',
    outline_skill: 'cloud-computing-definition',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/what-is-cloud-computing',
    difficulty: 'easy',
    type: 'single',
    stem: 'A financial cooperative (SACCO) in Eldoret wants to digitize member passbooks without building and staffing an on-premises data center. What fundamental attribute defines cloud computing for their setup?',
    options: [
      'The delivery of computing services including servers, storage, databases, and networking over the internet',
      'The mandatory requirement to purchase physical hardware and house it locally in Eldoret',
      'A software distribution model that functions only when computers are disconnected from the internet',
      'A specialized networking protocol reserved exclusively for international commercial banks'
    ],
    correct: [
      'The delivery of computing services including servers, storage, databases, and networking over the internet'
    ],
    explanation: 'Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the internet ("the cloud"). This enables organizations to innovate faster and scale with flexible resources.',
    wrong_option_notes: {
      'The mandatory requirement to purchase physical hardware and house it locally in Eldoret': 'This describes on-premises computing, which incurs heavy capital expenditures (CapEx).',
      'A software distribution model that functions only when computers are disconnected from the internet': 'Cloud computing inherently requires internet or dedicated network connectivity to deliver services.',
      'A specialized networking protocol reserved exclusively for international commercial banks': 'Cloud computing is an architectural compute model available to any organization or individual.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },
  {
    id: 'q-cloud-def-2',
    topic_id: 'top-cloud-def',
    outline_skill: 'cloud-computing-definition',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/what-is-cloud-computing',
    difficulty: 'medium',
    type: 'single',
    stem: 'Which statement accurately describes a core commercial characteristic of cloud computing compared to traditional on-premises IT infrastructure?',
    options: [
      'Cloud computing replaces variable operational expenses with large upfront long-term capital investments',
      'Cloud computing typically operates on a consumption-based pricing model where customers pay only for what they use',
      'Cloud computing requires customers to maintain and service physical server chassis and power supplies',
      'Cloud computing eliminates all security obligations for the purchasing organization'
    ],
    correct: [
      'Cloud computing typically operates on a consumption-based pricing model where customers pay only for what they use'
    ],
    explanation: 'A defining pillar of cloud computing is the consumption-based (pay-as-you-go) model. This eliminates upfront hardware costs and lets organizations align IT expenditure directly with demand.',
    wrong_option_notes: {
      'Cloud computing replaces variable operational expenses with large upfront long-term capital investments': 'Cloud computing does the opposite: it shifts CapEx to OpEx.',
      'Cloud computing requires customers to maintain and service physical server chassis and power supplies': 'The cloud provider manages all physical datacenter infrastructure, power, and facilities.',
      'Cloud computing eliminates all security obligations for the purchasing organization': 'Under the shared responsibility model, the customer retains responsibility for data, identities, and device access.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 2. shared-responsibility-model
  {
    id: 'q-shared-resp-1',
    topic_id: 'top-shared-responsibility',
    outline_skill: 'shared-responsibility-model',
    source_url: 'https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility',
    difficulty: 'medium',
    type: 'single',
    stem: 'A retail pharmacy group in Kumasi deploys a customized inventory database on an Azure Virtual Machine (IaaS). Who is responsible for patching the guest operating system and database software on that VM?',
    options: [
      'The customer (pharmacy group)',
      'Microsoft Azure physical datacenter staff',
      'The hardware manufacturer who built the server blades',
      'Both Microsoft and the customer share 50% automated OS patching'
    ],
    correct: [
      'The customer (pharmacy group)'
    ],
    explanation: 'In Infrastructure as a Service (IaaS), the cloud provider manages the physical hardware, virtualization layer, and datacenter facilities. The customer remains responsible for installing, configuring, and updating the guest operating system, runtime, middleware, and application code.',
    wrong_option_notes: {
      'Microsoft Azure physical datacenter staff': 'Microsoft secures physical host hardware and datacenter perimeters in IaaS, but never touches or patches customer guest OS installations.',
      'The hardware manufacturer who built the server blades': 'Hardware manufacturers have no relationship or operational access to running customer cloud workloads.',
      'Both Microsoft and the customer share 50% automated OS patching': 'Guest OS patching in standard IaaS is entirely the customer’s responsibility.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },
  {
    id: 'q-shared-resp-2',
    topic_id: 'top-shared-responsibility',
    outline_skill: 'shared-responsibility-model',
    source_url: 'https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility',
    difficulty: 'hard',
    type: 'single',
    stem: 'Across all cloud service delivery models (IaaS, PaaS, and SaaS), which responsibility is ALWAYS retained exclusively by the customer organization?',
    options: [
      'Information, data, and user identities',
      'Physical datacenter power and physical building security',
      'Hypervisor patch maintenance and host OS updates',
      'Physical fiber cabling and rack top-of-rack switches'
    ],
    correct: [
      'Information, data, and user identities'
    ],
    explanation: 'Under the Shared Responsibility Model, the customer is ALWAYS responsible for protecting their data and information, securing client devices and endpoints, and managing user identities and credentials regardless of the service tier.',
    wrong_option_notes: {
      'Physical datacenter power and physical building security': 'Physical facilities and hardware are always Microsoft’s responsibility in the cloud.',
      'Hypervisor patch maintenance and host OS updates': 'The host virtualization layer is managed by Microsoft across all cloud service types.',
      'Physical fiber cabling and rack top-of-rack switches': 'Physical network topology is managed completely by Microsoft.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 3. public-private-hybrid-models
  {
    id: 'q-cloud-models-1',
    topic_id: 'top-cloud-models',
    outline_skill: 'public-private-hybrid-cloud',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/what-is-cloud-computing#types-of-cloud-computing',
    difficulty: 'medium',
    type: 'single',
    stem: 'A commercial bank in Kigali must keep customer account balances stored on-premises due to local central bank statutory mandates, but wants to run its customer mobile analytics and marketing campaigns on Azure. What cloud model is this bank utilizing?',
    options: [
      'Hybrid cloud',
      'Private cloud only',
      'Public cloud only',
      'Community cloud only'
    ],
    correct: [
      'Hybrid cloud'
    ],
    explanation: 'A hybrid cloud connects an on-premises private datacenter with public cloud services (like Azure), allowing data and apps to be shared between them while respecting regulatory data residency requirements.',
    wrong_option_notes: {
      'Private cloud only': 'The bank is actively running workloads in public Azure, meaning it is not strictly private.',
      'Public cloud only': 'The bank retains on-premises infrastructure for core databases, so it is not exclusively public.',
      'Community cloud only': 'Community clouds are shared exclusively across distinct organizations with shared interests (e.g. government consortia).'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 4. consumption-based-model
  {
    id: 'q-pricing-models-1',
    topic_id: 'top-consumption-pricing',
    outline_skill: 'consumption-based-model',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-concepts-pricing-models',
    difficulty: 'easy',
    type: 'single',
    stem: 'A logistics platform in Mombasa experiences dramatic spikes in container tracking traffic during crop harvest seasons. How does the consumption-based pricing model financially benefit this startup?',
    options: [
      'They do not need to purchase idle servers for peak months, paying only for the compute resources consumed',
      'They pay a flat, non-negotiable yearly upfront fee regardless of whether tracking queries happen',
      'Microsoft covers 100% of all compute costs for African logistics entities automatically',
      'They must purchase depreciable physical hardware on five-year fixed capital leases'
    ],
    correct: [
      'They do not need to purchase idle servers for peak months, paying only for the compute resources consumed'
    ],
    explanation: 'With consumption-based pricing, there are no upfront costs, no need to purchase unused infrastructure, and organizations pay only for the exact resources they use. When traffic subsides, costs decrease immediately.',
    wrong_option_notes: {
      'They pay a flat, non-negotiable yearly upfront fee regardless of whether tracking queries happen': 'This describes fixed traditional licensing, the opposite of consumption pricing.',
      'Microsoft covers 100% of all compute costs for African logistics entities automatically': 'Azure is a commercial cloud provider requiring payment for consumed compute.',
      'They must purchase depreciable physical hardware on five-year fixed capital leases': 'This is traditional on-premises CapEx financing.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 5. serverless-computing
  {
    id: 'q-serverless-1',
    topic_id: 'top-serverless',
    outline_skill: 'serverless-computing',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-computing-serverless',
    difficulty: 'medium',
    type: 'single',
    stem: 'An educational app sends an SMS alert to parents whenever a school fee payment completes via mobile money. Developers write a small block of Python code that triggers only when a payment event arrives. Which cloud paradigm does this reflect?',
    options: [
      'Serverless computing (Event-driven)',
      'Dedicated physical server colocation',
      'Client-side offline desktop computation',
      'Manual mainframe batch operations'
    ],
    correct: [
      'Serverless computing (Event-driven)'
    ],
    explanation: 'Serverless computing (such as Azure Functions) enables developers to build applications faster by eliminating the need to manage infrastructure. Code executes only in response to events, and billing occurs only for the execution duration.',
    wrong_option_notes: {
      'Dedicated physical server colocation': 'Colocation requires renting physical rack space and purchasing hardware.',
      'Client-side offline desktop computation': 'Processing payment webhooks requires cloud-hosted endpoints that listen continuously.',
      'Manual mainframe batch operations': 'Batch operations are scheduled periodically rather than triggered instantaneously by incoming payment webhooks.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 6. high-availability-scalability
  {
    id: 'q-ha-scalability-1',
    topic_id: 'top-high-availability-scalability',
    outline_skill: 'high-availability-scalability',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-concepts-benefits#high-availability-and-scalability',
    difficulty: 'medium',
    type: 'single',
    stem: 'What is the fundamental difference between "scaling up" (vertical scaling) and "scaling out" (horizontal scaling)?',
    options: [
      'Scaling up adds more RAM or CPU cores to an existing VM, while scaling out adds more VM instances to distribute the workload',
      'Scaling up adds servers in different countries, while scaling out removes servers',
      'Scaling up is exclusively for storage accounts, while scaling out is exclusively for networking subnets',
      'Scaling up requires zero downtime, while scaling out permanently terminates the database'
    ],
    correct: [
      'Scaling up adds more RAM or CPU cores to an existing VM, while scaling out adds more VM instances to distribute the workload'
    ],
    explanation: 'Vertical scaling (scaling up) increases the capacity of an existing resource, such as upgrading a VM to a larger size with more CPUs or RAM. Horizontal scaling (scaling out) adds additional resource instances to work together, such as adding more VMs to an Azure Virtual Machine Scale Set.',
    wrong_option_notes: {
      'Scaling up adds servers in different countries, while scaling out removes servers': 'Geographic distribution relates to multi-region architectures, not vertical vs horizontal scaling.',
      'Scaling up is exclusively for storage accounts, while scaling out is exclusively for networking subnets': 'Both scaling concepts apply widely across compute, database, and container resources.',
      'Scaling up requires zero downtime, while scaling out permanently terminates the database': 'Scaling up often requires a restart to resize the VM, whereas scaling out adds parallel instances seamlessly.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 7. reliability-predictability
  {
    id: 'q-reliability-1',
    topic_id: 'top-reliability-predictability',
    outline_skill: 'reliability-predictability',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-concepts-benefits#reliability-and-predictability',
    difficulty: 'easy',
    type: 'single',
    stem: 'In cloud architecture, what does the term "reliability" specifically signify?',
    options: [
      'The ability of a system to recover from failures and continue to function correctly',
      'The guarantee that server compute power will be free of charge during weekends',
      'The restriction of application access to users on the same physical local area network',
      'The practice of disabling backups to maximize storage write speeds'
    ],
    correct: [
      'The ability of a system to recover from failures and continue to function correctly'
    ],
    explanation: 'Reliability is the ability of a system to recover from failures and continue functioning. It includes resilience (recovering from transient issues) and disaster recovery capabilities built into cloud platforms.',
    wrong_option_notes: {
      'The guarantee that server compute power will be free of charge during weekends': 'Cloud pricing is based on continuous resource consumption.',
      'The restriction of application access to users on the same physical local area network': 'This describes an on-premises intranet, not cloud reliability.',
      'The practice of disabling backups to maximize storage write speeds': 'Disabling backups severely destroys reliability and data safety.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 8. security-governance-manageability
  {
    id: 'q-sec-gov-1',
    topic_id: 'top-security-governance',
    outline_skill: 'security-governance-manageability',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/cloud-concepts-benefits#security-and-governance',
    difficulty: 'medium',
    type: 'single',
    stem: 'A pan-African telehealth provider needs to ensure that team members can automatically provision identical testing environments using repeatable scripts rather than manual portal clicking. Which cloud benefit does this illustrate?',
    options: [
      'Manageability (Management through code / automation)',
      'Physical building perimeter access control',
      'Hardware component desoldering capabilities',
      'Legacy copper wire impedance matching'
    ],
    correct: [
      'Manageability (Management through code / automation)'
    ],
    explanation: 'Manageability in the cloud refers to how easily systems can be maintained, configured, and scaled. Management through code (declarative Infrastructure as Code and automated templates) enables consistent, repeatable deployments without manual errors.',
    wrong_option_notes: {
      'Physical building perimeter access control': 'Physical access is handled by the cloud datacenter provider.',
      'Hardware component desoldering capabilities': 'Cloud users never handle physical hardware circuit boards.',
      'Legacy copper wire impedance matching': 'Telecommunications electrical physics are managed by carrier telcos, not application cloud developers.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 9. iaas-paas-saas-use-cases
  {
    id: 'q-iaas-paas-saas-1',
    topic_id: 'top-service-types-iaas-paas-saas',
    outline_skill: 'iaas-paas-saas-use-cases',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/types-of-cloud-services',
    difficulty: 'medium',
    type: 'single',
    stem: 'An enterprise wants to deploy an off-the-shelf business email and calendar suite where the provider manages servers, storage, networking, operating systems, and the application itself. What cloud service type is this?',
    options: [
      'Software as a Service (SaaS)',
      'Infrastructure as a Service (IaaS)',
      'Platform as a Service (PaaS)',
      'Bare metal on-premises leasing'
    ],
    correct: [
      'Software as a Service (SaaS)'
    ],
    explanation: 'Software as a Service (SaaS) delivers complete, centrally hosted software applications over the internet (such as Microsoft 365). The service provider manages the entire technology stack, and users connect through a web browser or client application.',
    wrong_option_notes: {
      'Infrastructure as a Service (IaaS)': 'In IaaS, the customer must manage and configure operating systems, middleware, and software applications.',
      'Platform as a Service (PaaS)': 'In PaaS, developers manage application code and configuration, while the provider manages runtime and OS.',
      'Bare metal on-premises leasing': 'This is non-cloud on-premises hardware procurement.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // ==============================================================
  // DOMAIN 2: Describe Azure architecture and services (35-40%)
  // ==============================================================

  // 10. regions-region-pairs-sovereign
  {
    id: 'q-regions-pairs-1',
    topic_id: 'top-regions-pairs-sovereign',
    outline_skill: 'regions-region-pairs-sovereign',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/regions-and-availability-zones',
    difficulty: 'medium',
    type: 'single',
    stem: 'South Africa North and South Africa West form an Azure region pair. What is a key operational benefit provided by Azure region pairs during platform updates or major disasters?',
    options: [
      'Azure serializes platform updates across paired regions so only one region is updated at a time, minimizing downtime risk',
      'Data stored in region pairs is automatically synchronized to public torrent networks for zero-cost caching',
      'Region pairs allow customers to run virtual machines completely free of all subscription charges',
      'Region pairs must always be located within exactly 10 kilometers of each other'
    ],
    correct: [
      'Azure serializes platform updates across paired regions so only one region is updated at a time, minimizing downtime risk'
    ],
    explanation: 'Azure region pairs reside within the same geography (typically at least 300 miles apart). Platform updates are rolled out to paired regions sequentially (one at a time) to prevent widespread downtime, and in a broad disaster, recovery priority is given to at least one region in each pair.',
    wrong_option_notes: {
      'Data stored in region pairs is automatically synchronized to public torrent networks for zero-cost caching': 'Customer data is securely kept on private Microsoft fiber backbones with strict encryption.',
      'Region pairs allow customers to run virtual machines completely free of all subscription charges': 'Compute resources consume normal meter rates in both regions.',
      'Region pairs must always be located within exactly 10 kilometers of each other': 'Region pairs are intentionally separated by hundreds of kilometers (typically 300+ miles) to isolate against simultaneous regional catastrophes.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 11. availability-zones-datacenters
  {
    id: 'q-az-dc-1',
    topic_id: 'top-availability-zones-datacenters',
    outline_skill: 'availability-zones-datacenters',
    source_url: 'https://learn.microsoft.com/azure/reliability/availability-zones-overview',
    difficulty: 'medium',
    type: 'single',
    stem: 'What is an Azure Availability Zone?',
    options: [
      'One or more physically separate datacenters within an Azure region, each equipped with independent power, cooling, and networking',
      'A software feature in Windows Server that compresses hard disk folders',
      'A worldwide network of satellites transmitting GPS time signals to smartphones',
      'A billing boundary that dictates which credit cards are accepted in West Africa'
    ],
    correct: [
      'One or more physically separate datacenters within an Azure region, each equipped with independent power, cooling, and networking'
    ],
    explanation: 'An Availability Zone is a high-availability offering that protects your applications and data from datacenter failures. Availability Zones are unique physical locations within an Azure region, each made up of one or more datacenters equipped with independent power, cooling, and networking.',
    wrong_option_notes: {
      'A software feature in Windows Server that compresses hard disk folders': 'This describes NTFS file compression, unrelated to cloud infrastructure.',
      'A worldwide network of satellites transmitting GPS time signals to smartphones': 'This refers to GPS satellite constellations.',
      'A billing boundary that dictates which credit cards are accepted in West Africa': 'Billing settings are managed at the Azure account/subscription layer.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 12. resource-hierarchy
  {
    id: 'q-res-hier-1',
    topic_id: 'top-resource-hierarchy',
    outline_skill: 'resource-hierarchy',
    source_url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/overview#the-scope-of-azure-resources',
    difficulty: 'medium',
    type: 'single',
    stem: 'What is the correct top-to-bottom hierarchy of management scopes in Microsoft Azure?',
    options: [
      'Management groups -> Subscriptions -> Resource groups -> Resources',
      'Subscriptions -> Management groups -> Resources -> Resource groups',
      'Resource groups -> Resources -> Subscriptions -> Management groups',
      'Resources -> Subscriptions -> Resource groups -> Management groups'
    ],
    correct: [
      'Management groups -> Subscriptions -> Resource groups -> Resources'
    ],
    explanation: 'Azure provides four levels of management scope: Management groups (containers for managing governance across multiple subscriptions) -> Subscriptions (grouping of user accounts and resources with billing boundaries) -> Resource groups (logical containers for related resources) -> Resources (individual service instances like VMs or databases).',
    wrong_option_notes: {
      'Subscriptions -> Management groups -> Resources -> Resource groups': 'Management groups sit above subscriptions, and resource groups sit above resources.',
      'Resource groups -> Resources -> Subscriptions -> Management groups': 'Inverted hierarchy; resources are the leaf nodes.',
      'Resources -> Subscriptions -> Resource groups -> Management groups': 'Completely unordered sequence.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 13. compute-containers-vms-functions
  {
    id: 'q-compute-types-1',
    topic_id: 'top-compute-containers-vms-functions',
    outline_skill: 'compute-containers-vms-functions',
    source_url: 'https://learn.microsoft.com/azure/fundamentals/azure-compute-services',
    difficulty: 'hard',
    type: 'single',
    stem: 'A fintech engineering team in Nairobi wants to package their Python microservice with all its dependencies so it starts in seconds, without virtualizing an entire operating system hardware stack. Which compute model should they choose?',
    options: [
      'Containers (e.g. Azure Container Apps or Azure Kubernetes Service)',
      'Azure Virtual Machines with full Windows Server installations',
      'Dedicated physical mainframe hardware co-location',
      'Bare metal rack server installation'
    ],
    correct: [
      'Containers (e.g. Azure Container Apps or Azure Kubernetes Service)'
    ],
    explanation: 'Containers virtualize at the operating system level, sharing the host OS kernel. This makes them lightweight, fast to start (seconds vs minutes for VMs), and portable across environments.',
    wrong_option_notes: {
      'Azure Virtual Machines with full Windows Server installations': 'Virtual Machines virtualize the hardware layer and run full guest operating systems, making them heavier and slower to boot.',
      'Dedicated physical mainframe hardware co-location': 'Traditional physical hosting requires high CapEx and lacks cloud container agility.',
      'Bare metal rack server installation': 'Bare metal lacks automated container orchestration and rapid auto-scaling.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 14. vm-options-scale-sets-avd
  {
    id: 'q-vm-options-1',
    topic_id: 'top-vm-options',
    outline_skill: 'vm-options-scale-sets-avd',
    source_url: 'https://learn.microsoft.com/azure/virtual-machines/overview',
    difficulty: 'medium',
    type: 'single',
    stem: 'Which Azure feature allows you to automatically create, manage, and scale a group of identical, load-balanced virtual machines based on CPU demand or a schedule?',
    options: [
      'Azure Virtual Machine Scale Sets',
      'Azure Arc',
      'Azure Storage Explorer',
      'Microsoft Defender for Identity'
    ],
    correct: [
      'Azure Virtual Machine Scale Sets'
    ],
    explanation: 'Azure Virtual Machine Scale Sets let you create and manage a group of load-balanced VMs. The number of VM instances can automatically increase or decrease in response to demand or a defined schedule, providing high availability and elasticity.',
    wrong_option_notes: {
      'Azure Arc': 'Azure Arc simplifies governance by projecting non-Azure on-premises/multi-cloud resources into Azure Resource Manager.',
      'Azure Storage Explorer': 'A standalone GUI utility for inspecting Azure storage blobs, tables, and queues.',
      'Microsoft Defender for Identity': 'A cloud-based security solution that leverages on-premises Active Directory signals to detect compromised identities.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 15. app-hosting-options
  {
    id: 'q-app-hosting-1',
    topic_id: 'top-app-hosting-options',
    outline_skill: 'app-hosting-options',
    source_url: 'https://learn.microsoft.com/azure/app-service/overview',
    difficulty: 'easy',
    type: 'single',
    stem: 'What type of service is Azure App Service?',
    options: [
      'Platform as a Service (PaaS) for hosting web apps, REST APIs, and mobile backends without managing web servers or operating systems',
      'Infrastructure as a Service (IaaS) requiring manual installation of Apache web server on raw VM disks',
      'Software as a Service (SaaS) like pre-built Microsoft 365 Outlook',
      'A hardware appliance installed into customer server racks'
    ],
    correct: [
      'Platform as a Service (PaaS) for hosting web apps, REST APIs, and mobile backends without managing web servers or operating systems'
    ],
    explanation: 'Azure App Service is an HTTP-based PaaS solution for hosting web applications, REST APIs, and mobile backends. Developers can deploy code or containers without having to manage VMs, OS patches, or web server runtimes.',
    wrong_option_notes: {
      'Infrastructure as a Service (IaaS) requiring manual installation of Apache web server on raw VM disks': 'App Service abstracts away the VM layer entirely; developers do not install web server binaries manually.',
      'Software as a Service (SaaS) like pre-built Microsoft 365 Outlook': 'SaaS provides complete end-user apps, whereas App Service is a developer platform for running custom code.',
      'A hardware appliance installed into customer server racks': 'Azure Stack Hub/Data Box are appliances; App Service is a cloud software service.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 16. networking-vnets-subnets-peering-dns
  {
    id: 'q-networking-1',
    topic_id: 'top-networking-vnets-peering-dns',
    outline_skill: 'networking-vnets-subnets-peering-dns',
    source_url: 'https://learn.microsoft.com/azure/virtual-network/virtual-networks-overview',
    difficulty: 'medium',
    type: 'single',
    stem: 'An organization needs two separate Azure Virtual Networks (VNets) in the same subscription to communicate securely with each other with the lowest possible latency, without routing traffic over the public internet. Which feature satisfies this requirement?',
    options: [
      'Virtual Network Peering (VNet Peering)',
      'Public internet port forwarding with public IP addresses on all servers',
      'USB flash drive sneaker-net courier transfer',
      'Azure DNS TXT verification records'
    ],
    correct: [
      'Virtual Network Peering (VNet Peering)'
    ],
    explanation: 'Virtual Network Peering connects two Azure virtual networks seamlessly. Traffic between peered virtual networks uses the Microsoft private backbone network with private IP addresses, completely bypassing the public internet with high bandwidth and low latency.',
    wrong_option_notes: {
      'Public internet port forwarding with public IP addresses on all servers': 'Exposing servers via public IPs routes traffic across the internet and increases security vulnerability.',
      'USB flash drive sneaker-net courier transfer': 'Physical media transfer is offline and completely impractical for real-time networking.',
      'Azure DNS TXT verification records': 'DNS records resolve domain names to addresses, but do not provide network routing conduits.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 17. vpn-gateway-expressroute-endpoints
  {
    id: 'q-connectivity-1',
    topic_id: 'top-connectivity-vpn-expressroute-endpoints',
    outline_skill: 'vpn-gateway-expressroute-endpoints',
    source_url: 'https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpngateways',
    difficulty: 'hard',
    type: 'single',
    stem: 'A financial institution in Lagos requires a private, high-speed connection between their headquarters datacenter and Azure that NEVER traverses the public internet and provides ultra-low latency. Which Azure connectivity solution should they purchase?',
    options: [
      'Azure ExpressRoute',
      'Point-to-Site VPN over public cellular data',
      'Standard Site-to-Site VPN over the public internet',
      'Direct broadband DSL line to an internet cafe'
    ],
    correct: [
      'Azure ExpressRoute'
    ],
    explanation: 'Azure ExpressRoute creates a private, dedicated connection between an organization’s on-premises infrastructure and Microsoft cloud services via a connectivity provider. ExpressRoute connections do not go over the public internet, offering higher security, reliability, and lower latencies.',
    wrong_option_notes: {
      'Point-to-Site VPN over public cellular data': 'Point-to-site VPN traverses the public internet from an individual laptop client.',
      'Standard Site-to-Site VPN over the public internet': 'Site-to-Site VPN encrypts traffic but still routes through the public internet with variable latency.',
      'Direct broadband DSL line to an internet cafe': 'Unrelated consumer public broadband.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 18. storage-services-access-tiers
  {
    id: 'q-storage-tiers-1',
    topic_id: 'top-storage-services-and-tiers',
    outline_skill: 'storage-services-access-tiers',
    source_url: 'https://learn.microsoft.com/azure/storage/common/storage-introduction',
    difficulty: 'medium',
    type: 'single',
    stem: 'A hospital in Accra must store patient X-ray and MRI scans for 10 years to meet legal mandates. These images are rarely accessed after the first month, and retrieval delays of several hours are completely acceptable. Which Blob storage access tier is most cost-effective for long-term retention?',
    options: [
      'Archive tier',
      'Hot tier',
      'Cool tier',
      'Premium Solid State Disk tier'
    ],
    correct: [
      'Archive tier'
    ],
    explanation: 'The Archive tier has the lowest storage cost among all Azure Blob access tiers. It is intended for data that can tolerate several hours of retrieval latency (rehydration) and remains stored for at least 180 days.',
    wrong_option_notes: {
      'Hot tier': 'Optimized for data that is in active use; has highest storage costs and lowest access costs.',
      'Cool tier': 'Optimized for infrequently accessed data stored for at least 30 days, but storage cost is higher than Archive.',
      'Premium Solid State Disk tier': 'Highest cost tier designed for ultra-low latency transactional I/O.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 19. storage-redundancy-options
  {
    id: 'q-storage-red-1',
    topic_id: 'top-storage-redundancy',
    outline_skill: 'storage-redundancy-options',
    source_url: 'https://learn.microsoft.com/azure/storage/common/storage-redundancy',
    difficulty: 'hard',
    type: 'single',
    stem: 'How does Zone-Redundant Storage (ZRS) replicate data within an Azure primary region?',
    options: [
      'It synchronously replicates data across three separate Azure availability zones within the primary region',
      'It writes three copies to a single physical rack within one individual datacenter',
      'It copies data to a datacenter located on another continent over undersea cables',
      'It burns data onto write-once optical discs mailed to corporate directors'
    ],
    correct: [
      'It synchronously replicates data across three separate Azure availability zones within the primary region'
    ],
    explanation: 'Zone-Redundant Storage (ZRS) synchronously replicates data across three Azure availability zones in the primary region. Each zone is an independent physical location with separated power, cooling, and networking, ensuring data remains available even if an entire datacenter suffers an outage.',
    wrong_option_notes: {
      'It writes three copies to a single physical rack within one individual datacenter': 'This describes Locally Redundant Storage (LRS), which protects against disk faults but not datacenter failure.',
      'It copies data to a datacenter located on another continent over undersea cables': 'This describes Geo-Redundant Storage (GRS), which replicates to a paired secondary region.',
      'It burns data onto write-once optical discs mailed to corporate directors': 'Fictitious manual procedure.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 20. file-transfer-and-migration-tools
  {
    id: 'q-migration-tools-1',
    topic_id: 'top-moving-files-migration',
    outline_skill: 'file-transfer-and-migration-tools',
    source_url: 'https://learn.microsoft.com/azure/storage/common/storage-choose-data-transfer-solution',
    difficulty: 'medium',
    type: 'single',
    stem: 'A mining exploration company in Lubumbashi has 80 Terabytes of historical survey imagery on offline servers with limited, expensive satellite internet. Which Microsoft migration service provides a physical, ruggedized hardware appliance shipped by courier to transfer this offline data to Azure Storage?',
    options: [
      'Azure Data Box',
      'AzCopy command-line utility',
      'Azure File Sync',
      'Azure DNS Private Resolver'
    ],
    correct: [
      'Azure Data Box'
    ],
    explanation: 'Azure Data Box is a physical appliance supplied by Microsoft that you connect to your local network, copy up to 80 TB of data onto with AES 256-bit encryption, and ship back to an Azure datacenter where the data is uploaded directly to your storage account.',
    wrong_option_notes: {
      'AzCopy command-line utility': 'AzCopy relies on internet bandwidth to upload data, which is impractical for 80 TB over low-bandwidth satellite.',
      'Azure File Sync': 'Azure File Sync synchronizes on-premises Windows Servers with Azure Files over the network.',
      'Azure DNS Private Resolver': 'A networking name resolution service, not a data migration tool.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 21. microsoft-entra-id-domain-services
  {
    id: 'q-entra-id-1',
    topic_id: 'top-entra-id-domain-services',
    outline_skill: 'microsoft-entra-id-domain-services',
    source_url: 'https://learn.microsoft.com/entra/fundamentals/whatis',
    difficulty: 'medium',
    type: 'single',
    stem: 'What is Microsoft Entra ID (formerly Azure Active Directory)?',
    options: [
      'A cloud-based identity and access management service that manages user accounts, authenticates users, and controls access to cloud resources',
      'A relational SQL database engine used to store e-commerce shopping carts',
      'A physical router installed in customer branch offices to boost Wi-Fi',
      'An email client software installed on desktop computers'
    ],
    correct: [
      'A cloud-based identity and access management service that manages user accounts, authenticates users, and controls access to cloud resources'
    ],
    explanation: 'Microsoft Entra ID is Microsoft’s cloud-based identity and access management solution that connects users to apps, devices, and data across multicloud and on-premises environments using modern authentication protocols (OIDC, SAML, OAuth 2.0).',
    wrong_option_notes: {
      'A relational SQL database engine used to store e-commerce shopping carts': 'This describes Azure SQL Database.',
      'A physical router installed in customer branch offices to boost Wi-Fi': 'This describes on-premises network hardware.',
      'An email client software installed on desktop computers': 'This describes Microsoft Outlook desktop software.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 22. authentication-methods-external-identities
  {
    id: 'q-auth-methods-1',
    topic_id: 'top-authentication-external-identities',
    outline_skill: 'authentication-methods-external-identities',
    source_url: 'https://learn.microsoft.com/entra/identity/authentication/concept-authentication-methods',
    difficulty: 'easy',
    type: 'single',
    stem: 'Which authentication mechanism requires a user to supply two or more distinct verification factors (something you know, something you have, or something you are) before granting access?',
    options: [
      'Multi-Factor Authentication (MFA)',
      'Single-sign-on without password challenge',
      'Anonymous FTP directory browsing',
      'Basic HTTP clear-text header authorization'
    ],
    correct: [
      'Multi-Factor Authentication (MFA)'
    ],
    explanation: 'Multi-Factor Authentication (MFA) is a process where a user is prompted during sign-in for additional forms of identification, such as a code on their phone (something you have) or a fingerprint scan (something you are) alongside a password (something you know).',
    wrong_option_notes: {
      'Single-sign-on without password challenge': 'SSO allows users to sign in once to access multiple systems, but does not intrinsically require multiple verification factors.',
      'Anonymous FTP directory browsing': 'Allows public unauthenticated access.',
      'Basic HTTP clear-text header authorization': 'Sends username and password without encryption or second factors.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 23. conditional-access-azure-rbac
  {
    id: 'q-rbac-ca-1',
    topic_id: 'top-conditional-access-rbac',
    outline_skill: 'conditional-access-azure-rbac',
    source_url: 'https://learn.microsoft.com/entra/identity/conditional-access/overview',
    difficulty: 'hard',
    type: 'single',
    stem: 'An administrator needs to enforce an "if-then" rule: IF an employee connects from an unrecognized country or untrusted IP address, THEN require Multi-Factor Authentication before granting access. Which feature provides this automated policy enforcement?',
    options: [
      'Microsoft Entra Conditional Access',
      'Azure Resource Locks',
      'Azure ExpressRoute peering',
      'Azure Storage Archive Tier'
    ],
    correct: [
      'Microsoft Entra Conditional Access'
    ],
    explanation: 'Conditional Access is the tool used by Microsoft Entra ID to bring signals together (such as user identity, location, device compliance, and risk score) to make policy decisions and enforce organizational access controls.',
    wrong_option_notes: {
      'Azure Resource Locks': 'Resource locks prevent accidental deletion or modification of Azure resources in Azure Resource Manager.',
      'Azure ExpressRoute peering': 'A private WAN connectivity mechanism.',
      'Azure Storage Archive Tier': 'A cold data storage tier.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 24. zero-trust-defense-defender-cloud
  {
    id: 'q-zero-trust-1',
    topic_id: 'top-zero-trust-defender',
    outline_skill: 'zero-trust-defense-defender-cloud',
    source_url: 'https://learn.microsoft.com/security/zero-trust/zero-trust-overview',
    difficulty: 'medium',
    type: 'single',
    stem: 'What are the three core guiding principles of the Zero Trust security model?',
    options: [
      'Verify explicitly, use least privileged access, and assume breach',
      'Trust everything inside corporate walls, assign admin to all users, and ignore logs',
      'Never use passwords, store keys on public web servers, and disable firewalls',
      'Purchase on-premises hardware, disable cloud backups, and block internet access'
    ],
    correct: [
      'Verify explicitly, use least privileged access, and assume breach'
    ],
    explanation: 'The Zero Trust security model is built on three fundamental tenets: 1. Verify explicitly (always authenticate and authorize based on all available data points). 2. Use least privilege access (limit user access with Just-In-Time and Just-Enough-Access). 3. Assume breach (minimize blast radius and segment access).',
    wrong_option_notes: {
      'Trust everything inside corporate walls, assign admin to all users, and ignore logs': 'This represents the outdated "castle-and-moat" security model that Zero Trust explicitly eliminates.',
      'Never use passwords, store keys on public web servers, and disable firewalls': 'Extremely reckless and insecure actions.',
      'Purchase on-premises hardware, disable cloud backups, and block internet access': 'Unrelated legacy physical tactics.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // ==============================================================
  // DOMAIN 3: Describe Azure management and governance (30-35%)
  // ==============================================================

  // 25. cost-factors-pricing-calculator
  {
    id: 'q-cost-calc-1',
    topic_id: 'top-cost-factors-pricing-calculator',
    outline_skill: 'cost-factors-pricing-calculator',
    source_url: 'https://learn.microsoft.com/azure/cost-management-billing/costs/plan-manage-costs',
    difficulty: 'easy',
    type: 'single',
    stem: 'Before deploying any workloads in Azure, an engineering director wants to estimate the expected monthly operational cost of 5 Virtual Machines, a SQL Database, and 2 Terabytes of Blob storage. Which free tool should they use?',
    options: [
      'Azure Pricing Calculator',
      'Azure PowerShell terminal cmdlet Format-Table',
      'Microsoft Defender for Endpoint',
      'Azure Virtual Network Peering analyzer'
    ],
    correct: [
      'Azure Pricing Calculator'
    ],
    explanation: 'The Azure Pricing Calculator is a web-based tool that lets you estimate costs for expected combinations of Azure products based on configuration attributes such as region, tier, capacity, and expected usage.',
    wrong_option_notes: {
      'Azure PowerShell terminal cmdlet Format-Table': 'Format-Table is a standard PowerShell utility for displaying shell output formatting.',
      'Microsoft Defender for Endpoint': 'An enterprise endpoint security platform for detecting device threats.',
      'Azure Virtual Network Peering analyzer': 'Fictitious diagnostic tool.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 26. cost-management-capabilities-tags
  {
    id: 'q-tags-cost-1',
    topic_id: 'top-cost-management-tags',
    outline_skill: 'cost-management-capabilities-tags',
    source_url: 'https://learn.microsoft.com/azure/cost-management-billing/costs/cost-analysis-common-uses',
    difficulty: 'medium',
    type: 'single',
    stem: 'A financial services firm with engineering teams in Nairobi, Cape Town, and Lagos shares a single Azure subscription. How can management categorize resources so that finance can report and bill cloud spending back to each specific city department?',
    options: [
      'Apply Azure resource tags (key-value metadata pairs such as "Department: Lagos")',
      'Create 500 different Azure subscriptions with separate credit cards',
      'Rename all virtual machines to start with the city initials manually',
      'Send monthly paper memo receipts to Microsoft headquarters'
    ],
    correct: [
      'Apply Azure resource tags (key-value metadata pairs such as "Department: Lagos")'
    ],
    explanation: 'Azure Resource Tags are key-value pairs of metadata applied to resources, resource groups, and subscriptions. They allow organizations to logically organize resources for cost accounting, billing chargebacks, and compliance auditing.',
    wrong_option_notes: {
      'Create 500 different Azure subscriptions with separate credit cards': 'Unnecessary administrative overhead and financial complexity.',
      'Rename all virtual machines to start with the city initials manually': 'VM naming does not group resources into structured billing reports and many resources cannot easily be renamed.',
      'Send monthly paper memo receipts to Microsoft headquarters': 'Microsoft billing is automated; paper memos do not apply.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 27. purview-azure-policy-resource-locks
  {
    id: 'q-policy-locks-1',
    topic_id: 'top-governance-purview-policy-locks',
    outline_skill: 'purview-azure-policy-resource-locks',
    source_url: 'https://learn.microsoft.com/azure/governance/policy/overview',
    difficulty: 'hard',
    type: 'single',
    stem: 'A compliance team must ensure that NO engineer can accidentally delete a production SQL Database resource group, even if the engineer has the powerful Owner RBAC role. What feature must be configured on that resource group?',
    options: [
      'A CanNotDelete (Delete) Resource Lock',
      'A ReadOnly Resource Lock',
      'An Azure Policy that forces VMs to be size B1s',
      'A Multi-Factor Authentication requirement for web browsing'
    ],
    correct: [
      'A CanNotDelete (Delete) Resource Lock'
    ],
    explanation: 'A CanNotDelete lock (Delete lock) in Azure Resource Manager allows authorized users to read and modify a resource, but completely blocks anyone (even subscription Owners) from deleting the resource until the lock is explicitly removed.',
    wrong_option_notes: {
      'A ReadOnly Resource Lock': 'A ReadOnly lock prevents all modifications (writes and updates), not just deletions, which would prevent authorized database updates.',
      'An Azure Policy that forces VMs to be size B1s': 'Policies enforce governance conditions, but standard policies do not block deletion actions on existing resources.',
      'A Multi-Factor Authentication requirement for web browsing': 'MFA secures identity sign-in, but does not protect against deletion by an authenticated Owner.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 28. management-tools-portal-shell-cli-powershell
  {
    id: 'q-mgmt-tools-1',
    topic_id: 'top-management-tools-portal-shell-cli-powershell',
    outline_skill: 'management-tools-portal-shell-cli-powershell',
    source_url: 'https://learn.microsoft.com/azure/azure-resource-manager/management/manage-resources-portal',
    difficulty: 'easy',
    type: 'single',
    stem: 'An IT technician travelling with a lightweight Chromebook tablet needs to run bash scripts against Azure without installing any local developer software or terminal emulators. Which browser-accessible tool should they use?',
    options: [
      'Azure Cloud Shell',
      'Visual Studio Enterprise desktop edition',
      'Local Windows Subsystem for Linux (WSL)',
      'USB bootable thumb drive'
    ],
    correct: [
      'Azure Cloud Shell'
    ],
    explanation: 'Azure Cloud Shell is an interactive, browser-accessible, authenticated terminal environment for managing Azure resources. It comes pre-installed with common tools (Azure CLI, PowerShell, bash, Git) without needing local installations.',
    wrong_option_notes: {
      'Visual Studio Enterprise desktop edition': 'Requires full Windows/Mac desktop OS installation with substantial storage requirements.',
      'Local Windows Subsystem for Linux (WSL)': 'Requires a full Windows PC environment.',
      'USB bootable thumb drive': 'Unnecessary and unworkable on locked mobile tablets.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 29. azure-arc-iac-arm-templates
  {
    id: 'q-arc-iac-1',
    topic_id: 'top-azure-arc-arm-iac',
    outline_skill: 'azure-arc-iac-arm-templates',
    source_url: 'https://learn.microsoft.com/azure/azure-arc/overview',
    difficulty: 'medium',
    type: 'single',
    stem: 'A financial institution operates Windows and Linux servers in their own private data center in Johannesburg alongside clusters in Amazon Web Services (AWS). Which Azure service allows them to govern and manage these non-Azure machines directly from the Azure portal using Azure Resource Manager policies and tags?',
    options: [
      'Azure Arc',
      'Azure ExpressRoute',
      'Azure Front Door',
      'Microsoft Intune'
    ],
    correct: [
      'Azure Arc'
    ],
    explanation: 'Azure Arc extends Azure governance, management, and cloud services to any infrastructure across on-premises, edge, and multi-cloud environments (including AWS and Google Cloud), allowing them to be managed just like native Azure resources.',
    wrong_option_notes: {
      'Azure ExpressRoute': 'Provides a private network circuit between on-premises and Azure, but does not provide multi-cloud server governance.',
      'Azure Front Door': 'A global scalable entry point that uses Microsoft global edge network to deliver high-performance web apps.',
      'Microsoft Intune': 'A cloud-based endpoint management solution for mobile devices and corporate laptops.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },

  // 30. advisor-service-health-azure-monitor
  {
    id: 'q-monitoring-1',
    topic_id: 'top-advisor-service-health-monitor',
    outline_skill: 'advisor-service-health-azure-monitor',
    source_url: 'https://learn.microsoft.com/azure/azure-monitor/overview',
    difficulty: 'medium',
    type: 'single',
    stem: 'Match the Azure monitoring service to its correct primary function: Which service provides a personalized dashboard notifying you about global service outages, planned infrastructure maintenance, and regional degradations impacting YOUR specific subscriptions?',
    options: [
      'Azure Service Health',
      'Azure Advisor',
      'Application Insights',
      'Log Analytics workspace query editor'
    ],
    correct: [
      'Azure Service Health'
    ],
    explanation: 'Azure Service Health provides personalized guidance and support when issues in Azure services affect your specific environment. It informs you about service outages, planned maintenance events, and health advisories.',
    wrong_option_notes: {
      'Azure Advisor': 'Analyzes your configurations and telemetry to offer personalized recommendations across cost, security, reliability, operational excellence, and performance.',
      'Application Insights': 'A feature of Azure Monitor that monitors live web application performance, requests, and exceptions.',
      'Log Analytics workspace query editor': 'A tool for writing Kusto Query Language (KQL) queries against log data.'
    },
    status: 'verified',
    verified_at: '2026-10-22T10:00:00Z',
  },
];


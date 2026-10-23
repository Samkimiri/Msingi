# Content Scrutiny & Fact-Checking Log

> Items logged here are flagged for human inspection to prevent common AZ-900 syllabus misconceptions and outdated Azure naming.

---

## 1. High-Scrutiny Verification Log

### Topic 1: Azure Policy vs RBAC vs Resource Locks
- **Question ID**: `q-policy-locks-1`
- **Syllabus Skill**: `purview-azure-policy-resource-locks`
- **Scrutiny Check**: Ensure question differentiates that RBAC controls *who* can act, Policy controls *what properties* resources must comply with, and Locks prevent accidental deletion even for Subscription Owners.
- **Source Verification**: Verified against [Microsoft Learn: Lock resources to prevent unexpected changes](https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources). CanNotDelete lock successfully verified.
- **Status**: PASSED.

### Topic 2: Availability Zones vs Availability Sets vs Region Pairs
- **Question IDs**: `q-regions-pairs-1`, `q-az-dc-1`
- **Syllabus Skills**: `regions-region-pairs-sovereign`, `availability-zones-datacenters`
- **Scrutiny Check**: Verify distinction between:
  1. Availability Sets: protects against rack/power failures inside a single datacenter (fault & update domains).
  2. Availability Zones: distinct physical datacenters with independent infrastructure inside one region.
  3. Region Pairs: 300+ miles apart, cross-region replication for catastrophic geographic failure.
- **Source Verification**: Verified against [Microsoft Learn: Regions and Availability Zones](https://learn.microsoft.com/azure/fundamentals/regions-and-availability-zones).
- **Status**: PASSED.

### Topic 3: Storage Redundancy (LRS vs ZRS vs GRS vs GZRS)
- **Question ID**: `q-storage-red-1`
- **Syllabus Skill**: `storage-redundancy-options`
- **Scrutiny Check**: Confirmed that ZRS replicates across 3 zones in the primary region, while GRS replicates asynchronously across region pairs.
- **Source Verification**: Verified against [Microsoft Learn: Azure Storage Redundancy](https://learn.microsoft.com/azure/storage/common/storage-redundancy).
- **Status**: PASSED.

### Topic 4: Azure Advisor vs Service Health vs Azure Monitor
- **Question ID**: `q-monitoring-1`
- **Syllabus Skill**: `advisor-service-health-azure-monitor`
- **Scrutiny Check**: Confirm Service Health notifies users of outages affecting *their specific subscriptions*, Advisor offers proactive optimization recommendations, and Monitor handles metric/log telemetry.
- **Source Verification**: Verified against [Microsoft Learn: Azure Service Health Overview](https://learn.microsoft.com/azure/service-health/overview).
- **Status**: PASSED.

### Topic 5: Microsoft Entra ID vs Entra Domain Services
- **Question ID**: `q-entra-id-1`
- **Syllabus Skill**: `microsoft-entra-id-domain-services`
- **Scrutiny Check**: Verify that "Azure Active Directory" name is updated to "Microsoft Entra ID" and modern REST/OAuth protocols are highlighted.
- **Source Verification**: Verified against [Microsoft Learn: What is Microsoft Entra ID?](https://learn.microsoft.com/entra/fundamentals/whatis).
- **Status**: PASSED.


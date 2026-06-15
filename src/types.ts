/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  userRole: "Buyer" | "Seller" | "Investor" | "Advisor" | "Lender" | "Other";
  transactionStage: "Exploring" | "Under LOI" | "In diligence" | "Preparing to sell" | "Post-close";
  estimatedDealSize: "<$1M" | "$1M-$5M" | "$5M-$20M" | "$20M+" | "Not sure";
  serviceNeeded: string[]; // Options: "QOE Lite", "Full QOE", "Buy-side due diligence", "Sell-side readiness", "CFO support"
  timeline: "ASAP" | "2-4 weeks" | "1-3 months" | "3+ months";
  message: string;
}

export interface GHLAutomationStep {
  id: string;
  title: string;
  status: "pending" | "active" | "completed";
  icon: string;
  description: string;
}

export interface SecureDocument {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  status: "uploaded" | "scanning" | "decrypting" | "analyzing" | "processed";
  progress: number;
  encryptedHash: string;
  sensitivity: "High" | "Medium" | "Critical";
}

export interface LiveNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: "info" | "success" | "warning";
  read: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

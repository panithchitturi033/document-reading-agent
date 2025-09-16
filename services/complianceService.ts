
import { ComplianceStatus } from '../types';

/**
 * Checks a name against a watchlist CSV file.
 * This is a mock compliance agent that does not use AI.
 * @param name The name to check.
 * @returns A promise that resolves to 'Flagged' or 'Approved'.
 */
export const checkCompliance = async (name: string): Promise<Exclude<ComplianceStatus, 'Checking' | null>> => {
  try {
    // Simulate network delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await fetch('/watchlist.csv');
    if (!response.ok) {
      throw new Error(`Could not load watchlist file. Status: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = csvText.split('\n').map(row => row.trim().toLowerCase());
    
    // Skip header row and filter out empty lines
    const watchlistNames = rows.slice(1).filter(row => row);

    const nameToCheck = name.trim().toLowerCase();

    const isFlagged = watchlistNames.some(watchlistedName => watchlistedName === nameToCheck);

    if (isFlagged) {
      console.log(`Compliance check: ${name} is FLAGGED.`);
      return 'Flagged';
    } else {
      console.log(`Compliance check: ${name} is APPROVED.`);
      return 'Approved';
    }
  } catch (error) {
    console.error('Compliance check failed:', error);
    // In a real app, robust error handling is crucial. For this demo,
    // we will not block the user and will mark as approved, but this could
    // default to 'Flagged' or an error state depending on business rules.
    throw new Error("The compliance check couldn't be completed.");
  }
};

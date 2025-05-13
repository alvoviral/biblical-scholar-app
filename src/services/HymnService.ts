
import { Hymn } from "@/types/hymn";
import { sampleHymns } from "@/data/sampleHymns";

// You'll need to set this to your API endpoint
const API_URL = "http://localhost:3000/api";

// Helper function to check if the API is available
const checkApiAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/hymns`, { 
      method: 'HEAD',
      // Small timeout to quickly determine if API is available
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.warn("API not available, using fallback data");
    return false;
  }
};

// Flag to track if we're using the fallback
let usingFallback = false;

export const HymnService = {
  getAllHymns: async (): Promise<Hymn[]> => {
    try {
      if (!usingFallback && await checkApiAvailability()) {
        const response = await fetch(`${API_URL}/hymns`);
        if (!response.ok) {
          throw new Error("Failed to fetch hymns");
        }
        return await response.json();
      } else {
        usingFallback = true;
        console.info("Using fallback hymn data");
        
        // Try to get from local storage first if available (offline mode)
        const offlineHymns = localStorage.getItem('harpa-offline-hymns');
        if (offlineHymns) {
          return JSON.parse(offlineHymns);
        }
        
        return sampleHymns;
      }
    } catch (error) {
      console.error("Error fetching hymns:", error);
      usingFallback = true;
      
      // Try to get from local storage
      const offlineHymns = localStorage.getItem('harpa-offline-hymns');
      if (offlineHymns) {
        return JSON.parse(offlineHymns);
      }
      
      return sampleHymns;
    }
  },

  getHymnByNumber: async (number: number): Promise<Hymn | null> => {
    try {
      if (!usingFallback && await checkApiAvailability()) {
        const response = await fetch(`${API_URL}/hymns/search/number/${number}`);
        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error("Failed to fetch hymn");
        }
        return await response.json();
      } else {
        usingFallback = true;
        
        // Try offline storage first
        const offlineHymns = localStorage.getItem('harpa-offline-hymns');
        if (offlineHymns) {
          const hymns = JSON.parse(offlineHymns);
          return hymns.find((h: Hymn) => h.number === number) || null;
        }
        
        return sampleHymns.find(h => h.number === number) || null;
      }
    } catch (error) {
      console.error(`Error fetching hymn #${number}:`, error);
      usingFallback = true;
      
      // Try offline storage
      const offlineHymns = localStorage.getItem('harpa-offline-hymns');
      if (offlineHymns) {
        const hymns = JSON.parse(offlineHymns);
        return hymns.find((h: Hymn) => h.number === number) || null;
      }
      
      return sampleHymns.find(h => h.number === number) || null;
    }
  },

  searchHymns: async (query: string): Promise<Hymn[]> => {
    try {
      if (!usingFallback && await checkApiAvailability()) {
        const response = await fetch(`${API_URL}/hymns/search/title/${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error("Failed to search hymns");
        }
        return await response.json();
      } else {
        usingFallback = true;
        
        // Try offline storage first
        const offlineHymns = localStorage.getItem('harpa-offline-hymns');
        let hymnsToSearch = offlineHymns ? JSON.parse(offlineHymns) : sampleHymns;
        
        return hymnsToSearch.filter((h: Hymn) => 
          h.title.toLowerCase().includes(query.toLowerCase()) ||
          h.number.toString().includes(query)
        );
      }
    } catch (error) {
      console.error("Error searching hymns:", error);
      usingFallback = true;
      
      // Try offline storage
      const offlineHymns = localStorage.getItem('harpa-offline-hymns');
      let hymnsToSearch = offlineHymns ? JSON.parse(offlineHymns) : sampleHymns;
      
      return hymnsToSearch.filter((h: Hymn) => 
        h.title.toLowerCase().includes(query.toLowerCase()) ||
        h.number.toString().includes(query)
      );
    }
  }
};

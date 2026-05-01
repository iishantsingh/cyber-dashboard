import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch CVE threats from public NVD API
export const fetchThreats = createAsyncThunk('threats/fetch', async (keyword = 'critical') => {
  const response = await axios.get(
    `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${keyword}&resultsPerPage=20`
  );
  return response.data.vulnerabilities || [];
});

const threatsSlice = createSlice({
  name: 'threats',
  initialState: {
    items: [],
    status: 'idle',  // idle | loading | succeeded | failed
    error: null,
    searchQuery: '',
    filterSeverity: 'all',
    sortBy: 'date',
    currentPage: 1,
    itemsPerPage: 8,
    lastRefreshed: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilter: (state, action) => {
      state.filterSeverity = action.payload;
      state.currentPage = 1;
    },
    setSort: (state, action) => {
      state.sortBy = action.payload;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchThreats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(fetchThreats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSearch, setFilter, setSort, setPage } = threatsSlice.actions;
export default threatsSlice.reducer;

// ===== SELECTORS =====
export const selectFilteredThreats = (state) => {
  let items = [...state.threats.items];
  const { searchQuery, filterSeverity, sortBy } = state.threats;

  // Search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter(item => {
      const desc = item.cve?.descriptions?.[0]?.value || '';
      const id = item.cve?.id || '';
      return desc.toLowerCase().includes(q) || id.toLowerCase().includes(q);
    });
  }

  // Filter by severity
  if (filterSeverity !== 'all') {
    items = items.filter(item => {
      const score = item.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore ||
                    item.cve?.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore || 0;
      if (filterSeverity === 'critical') return score >= 9.0;
      if (filterSeverity === 'high') return score >= 7.0 && score < 9.0;
      if (filterSeverity === 'medium') return score >= 4.0 && score < 7.0;
      if (filterSeverity === 'low') return score < 4.0;
      return true;
    });
  }

  // Sort
  if (sortBy === 'date') {
    items.sort((a, b) => new Date(b.cve?.published) - new Date(a.cve?.published));
  } else if (sortBy === 'score_desc') {
    items.sort((a, b) => {
      const sa = a.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
      const sb = b.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
      return sb - sa;
    });
  } else if (sortBy === 'score_asc') {
    items.sort((a, b) => {
      const sa = a.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
      const sb = b.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore || 0;
      return sa - sb;
    });
  }

  return items;
};

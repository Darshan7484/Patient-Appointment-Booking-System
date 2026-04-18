// Reusable Search and Filter Component
// Works with any list/table data

import React, { useState, useMemo } from 'react';

export default function SearchFilter({
  data = [],
  searchFields = [],
  onFiltered = () => {},
  placeholder = 'Search...',
  className = '',
  showAdvanced = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return String(value).toLowerCase().includes(term);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        result = result.filter(item => {
          const itemValue = String(getNestedValue(item, key)).toLowerCase();
          return value.some(v => itemValue.includes(String(v).toLowerCase()));
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const aVal = getNestedValue(a, sortBy);
        const bVal = getNestedValue(b, sortBy);

        let comparison = 0;
        if (typeof aVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number') {
          comparison = aVal - bVal;
        } else if (aVal instanceof Date) {
          comparison = aVal - bVal;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    onFiltered(result);
    return result;
  }, [searchTerm, filters, sortBy, sortOrder, data, searchFields, onFiltered]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: prev[field]?.includes(value)
        ? prev[field].filter(v => v !== value)
        : [...(prev[field] || []), value]
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('');
  };

  const activeFiltersCount = Object.values(filters).flat().length + (searchTerm ? 1 : 0);

  return (
    <div className={`card border-0 shadow-sm mb-3 ${className}`}>
      <div className="card-body p-3">
        {/* Search Bar */}
        <div className="row align-items-end g-2 mb-2">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="col-md-4">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By...</option>
              {searchFields.map(field => (
                <option key={field} value={field}>
                  {formatFieldName(field)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Options (if enabled) */}
        {showAdvanced && activeFiltersCount > 0 && (
          <div className="mt-2 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-funnel me-1"></i>
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </small>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={clearFilters}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>Reset All
            </button>
          </div>
        )}

        {/* Sort Order Toggle */}
        {sortBy && (
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <i className={`bi bi-arrow-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
              Sort {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="card-footer bg-light small text-muted">
        Showing {filteredData.length} of {data.length} results
      </div>
    </div>
  );
}

// Helper function to get nested object values
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, prop) => current?.[prop], obj) || '';
}

// Helper function to format field names
function formatFieldName(field) {
  return field
    .split('.')
    .pop()
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

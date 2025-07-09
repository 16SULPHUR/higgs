'use client'; 

const SEARCH_CRITERIA_KEY = 'roomSearchCriteria';

interface SearchCriteria {
  startDateTimeISO: string;
  endDateTimeISO: string;
}

export function saveSearchCriteria(criteria: SearchCriteria) {
  try {
    localStorage.setItem(SEARCH_CRITERIA_KEY, JSON.stringify(criteria));
  } catch (error) {
    console.error("Could not save to localStorage", error);
  }
}

export function getSearchCriteria(): SearchCriteria | null {
  try {
    const storedData = localStorage.getItem(SEARCH_CRITERIA_KEY);
    if (!storedData) return null;
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Could not read from localStorage", error);
    return null;
  }
}
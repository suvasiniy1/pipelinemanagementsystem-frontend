import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { RiContactsBookFill } from "react-icons/ri";
import { personService } from '../../services/personService';
import { DealService } from '../../services/dealService';

export const SearchBar = () => {
    const navigate = useNavigate(); // useNavigate hook
    const [searchValue, setSearchValue] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]); // Array to hold search results
    const [filteredResults, setFilteredResults] = useState<any[]>([]); // For filtered results
    const [error, setError] = useState<Error | null>(null); // For error handling
    const [loading, setLoading] = useState(false); // For loading indicator

    const personSvc = new personService(null);
    const dealSvc = new DealService(null);
    const key = window.location.href; 
    // Effect to fetch data whenever the searchValue changes
    useEffect(() => {
        if (searchValue.trim() === "") {
            setSearchResults([]);
            setFilteredResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);  // Start loading
            setError(null);  // Clear previous error

            try {
                const dealData = await dealSvc.searchDeals(searchValue);  // Use the updated backend method
                console.log('Search Results:', dealData);  // Debugging API response
                setSearchResults(dealData);
                setFilteredResults(dealData);  // Initially set all results as filtered
            } catch (error) {
                console.error('Error fetching data:', error);  // Log any error
                setError(error as Error);  // Capture and set any errors
            } finally {
                setLoading(false);  // Stop loading after data is fetched
            }
        };

        // Call the async function to fetch results
        fetchResults();
    }, [searchValue]);

    useEffect(() => {
        console.log('Filtered Results:', filteredResults);
    }, [filteredResults]);

    useEffect(() => {
        return () => {
            setSearchResults([]);
            setFilteredResults([]);
        };
    }, [navigate]);

    // Handle search input change and filter results as the user types
    interface SearchResult {
        contactPerson?: string;
        title?: string;
        treatmentName?: string;
        email?: string;  
        dealId?: string; 
        pipeLineId?: string;  
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchValue(value);

        if (value.trim() !== "") {
            const filtered = searchResults
                .filter((item: SearchResult) =>
                    item.contactPerson?.toLowerCase().includes(value) ||
                    item.title?.toLowerCase().includes(value) ||
                    item.treatmentName?.toLowerCase().includes(value) ||
                    item.email?.toLowerCase().includes(value)  // Search by email as well
                )
                .reduce((acc: SearchResult[], current: SearchResult) => {
                    // Avoid duplicates based on contactPerson or email, ignoring dealID
                    const duplicate = acc.find((item: SearchResult) =>
                        (item.contactPerson === current.contactPerson && current.contactPerson) ||
                        (item.email === current.email && current.email) ||
                        (item.treatmentName === current.treatmentName && current.treatmentName)
                    );
                    if (!duplicate) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

            setFilteredResults(filtered); // Set the filtered results
        } else {
            setFilteredResults([]); // Clear filtered results if input is empty
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();  // Prevent form submission or default button behavior
    };

    // Function to handle navigation to a specific item
    const navigateToItem = (item: { dealID?: string, pipelineID?: string, personID?: string }) => {
        console.log("Navigating to deal:", item.dealID, "in pipeline:", item.pipelineID);
    
        if (item.dealID && item.pipelineID) {
            navigate(`/deal?id=${item.dealID}&pipeLineId=${item.pipelineID}`);
        } else if (item.personID) {
            navigate(`/person?id=${item.personID}`, { replace: true });
        } else {
            console.error("No valid dealID or personID found for navigation.");
        }
    
        setSearchValue(""); // Clear search state
        setFilteredResults([]);
    };

    return (
        <>
            <div
            className="d-flex headsearchrow align-items-center"
            style={{ height: '40px', justifyContent: 'center', padding: '0', marginTop: '5px' }}
        >
                {/* Search Input */}
                <div className="ui headsearch">
                <div className="ui icon headinput" style={{ margin: '0', padding: '0', height: '100%' }}>
                    <form onSubmit={handleSearch}>
                        <input
                            value={searchValue}
                            onChange={handleSearchChange}
                            className="form-control"
                            type="text"
                            placeholder="Search by name, email, or procedure"
                            style={{
                                height: '35px', // Set a specific height for the input
                                padding: '0 12px', // Adjust padding for centering
                                boxSizing: 'border-box',
                                width: '500px', // Increased width for better readability
                                borderRadius: '25px', // Smooth rounded corners
                                textAlign: 'center', // Center-align placeholder text
                                lineHeight: '35px', // Ensure placeholder is vertically centered
                                fontSize: '14px' // Adjust font size for readability
                            }}
                        />
                        {/* Search icon button */}
                        <button
                            type="button"
                            className="search-icon-button"
                            onClick={(e) => handleSearch(e)}
                            style={{
                                height: '100%',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px'
                            }}
                        >
                            <i className="rs-icon rs-icon-search" />
                        </button>
                    </form>
                </div>
                <div className="results" />
            </div>
                {/* Show loading indicator */}
                {loading && <p>Loading...</p>}

                {/* Show error message if any */}
                {error && <p className="error-message">{error.message}</p>}

                {/* Render Filtered Search Results */}
                {filteredResults.length > 0 && (
                    <div 
                        className="search-results-dropdown" 
                        style={{
                            position: 'absolute',
                            zIndex: 1000,
                            top: '50px',
                            width: '300px',
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            padding: '10px'
                        }}
                    >
                         <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                            {filteredResults.map((item, index) => (
                               <li 
                               key={item.dealID}  // Use dealID as the key if it's unique
                               onClick={() => navigateToItem(item)} 
                               style={{ 
                                   padding: '10px', 
                                   cursor: 'pointer', 
                                   borderBottom: '1px solid #eee' 
                               }}
                           >
                               {item.contactPerson && <span>{item.contactPerson}</span>}
                               {item.email && <span> ({item.email})</span>}
                               {item.treatmentName && <span> - {item.treatmentName}</span>}
                           </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/*
                <div className="quickadd-menu">
                    <Dropdown className="quickadd-menuicon">
                        <Dropdown.Toggle id="quick-dropdown-autoclose-true">
                            <FontAwesomeIcon icon={faPlus} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="quickadd-menulist">
                        
                            <Dropdown.ItemText>
                                <FontAwesomeIcon icon={faDollarSign} /> Deals
                            </Dropdown.ItemText>

                           
                            <Dropdown.ItemText>
                                <RiContactsBookFill /> Persons
                            </Dropdown.ItemText>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                */}
            </div>
        </>
    );
};

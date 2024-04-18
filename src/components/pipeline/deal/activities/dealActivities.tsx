import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ErrorBoundary } from 'react-error-boundary';
import { Deal } from '../../../../models/deal';
import { Notes } from '../../../../models/notes';
import { NotesService } from '../../../../services/notesService';
import DealNotes from './dealNotes';
import EmailActivites from './emailActivites';
import CallsActivites from './callsActivites';
import TasksActivites from './tasksActivites';

type params = {
    dealItem: Deal
}
const DealActivities = (props: params) => {
    const { dealItem, ...others } = props;
    const [defaultActiveKey, setdefaultActiveKey] = useState("activity_sub");


    return (
        <>
            <div className='timeline-tabscontent'>
                <Tabs
                    defaultActiveKey={defaultActiveKey}
                    transition={false}
                    onSelect={(e:any)=>setdefaultActiveKey(e)}
                    id="noanim-tab-example"
                    className="mb-5 activity-subtab"
                >
                    <Tab eventKey="activity_sub" title="Activity">
                        <div className='activityfilter-row pb-3'>
                            <div className='activityfilter-col1'>
                                <label>Filter by:</label>
                                <select className=''>
                                    <option>Filter activities (1/19)</option>
                                    <option>Filter activities (5/19)</option>
                                    <option>Filter activities (8/19)</option>
                                    <option>Filter activities (13/19)</option>
                                    <option>Filter activities (19/19)</option>
                                </select>
                                <Dropdown className='dropdown-link dropdown-alluser ml-2'>
                                    <Dropdown.Toggle id="dropdown-alluser">All users</Dropdown.Toggle>
                                    <Dropdown.Menu className='dropdown-alluserlist'>
                                        <Dropdown.Item href="#/action-1">User One</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">User Two</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <h3>Upcoming</h3>
                        <div className='activityfilter-accrow mb-3'>
                            <Accordion className='activityfilter-acco'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span className='accoheader-title'>
                                            <strong>Task</strong> assigned to sudhakar balla
                                        </span>
                                        <span className='accoheader-date'>Apr 11, 2024 at 2:03 PM GMT+5:30</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                    <div className='accofooter'>
                                        <FontAwesomeIcon icon={faCircleCheck} /> First call
                                    </div>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <h3>April 2024</h3>
                        <div className='activityfilter-accrow  mb-3'>
                            <Accordion className='activityfilter-acco'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span className='accoheader-title'>
                                            <strong>Note</strong> by sudhakar balla
                                        </span>
                                        <span className='accoheader-date'>Apr 11, 2024 at 2:03 PM GMT+5:30</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                    <div className='accofooter'>
                                        First note created
                                    </div>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <h3>Upcoming</h3>
                        <div className='activityfilter-accrow mb-3'>
                            <Accordion className='activityfilter-acco'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span className='accoheader-title'>
                                            <strong>Task</strong> assigned to sudhakar balla
                                        </span>
                                        <span className='accoheader-date'>Apr 11, 2024 at 2:03 PM GMT+5:30</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                    <div className='accofooter'>
                                        <FontAwesomeIcon icon={faCircleCheck} /> First call
                                    </div>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                        <h3>April 2024</h3>
                        <div className='activityfilter-accrow  mb-3'>
                            <Accordion className='activityfilter-acco'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span className='accoheader-title'>
                                            <strong>Note</strong> by sudhakar balla
                                        </span>
                                        <span className='accoheader-date'>Apr 11, 2024 at 2:03 PM GMT+5:30</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                        culpa qui officia deserunt mollit anim id est laborum.
                                    </Accordion.Body>
                                    <div className='accofooter'>
                                        First note created
                                    </div>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    </Tab>
                    <Tab eventKey="notes" title="Notes">
                        <DealNotes dealId={dealItem.dealID} />
                    </Tab>
                    <Tab eventKey="email" title="Email">
                        <EmailActivites/>
                    </Tab>
                    <Tab eventKey="calls" title="Calls">
                        <CallsActivites/>
                    </Tab>
                    <Tab eventKey="tasks" title="Tasks">
                        <TasksActivites/>
                    </Tab>
                </Tabs>

            </div>

        </>
    )
}

export default DealActivities
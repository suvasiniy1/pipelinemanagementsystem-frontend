import { faCircleCheck, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import SelectDropdown from '../../../elements/SelectDropdown';
import { Notes } from '../../../models/notes';
import { AxiosError } from 'axios';
import { NotesService } from '../../../services/notesService';
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';
import { Deal } from '../../../models/deal';
import moment from 'moment';
import NotesAddEdit from './notesAddEdit';
import { Spinner } from 'react-bootstrap';
import Util from '../../../others/util';

type params = {
    dealItem: Deal
}
const DealActivities = (props: params) => {
    const { dealItem, ...others } = props;
    const notesSvc = new NotesService(ErrorBoundary);
    const [notesList, setNotesList] = useState<Array<Notes>>([]);
    const [error, setError] = useState<AxiosError>();
    const [dialogIsOpen, setDialogIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [defaultActiveKey, setdefaultActiveKey]=useState("activity_sub");

    useEffect(() => {
        loadNotes();
    }, [])

    const loadNotes = () => {
        setIsLoading(true);
        notesSvc.getNotes(dealItem.dealID).then(res => {
            
            (res as Array<Notes>).forEach(i=>{
                i.updatedDate = i.updatedDate ?? i.createdDate;
            });
            setNotesList(Util.sortList(res, "updatedDate", "desc"));
            setIsLoading(false);
        }).catch(err => {
            setError(err);
            setIsLoading(false);
        })
    }

    
    return (
        <>
            {isLoading ? <div className="alignCenter"><Spinner /></div> :
                <div className='timeline-tabscontent'>
                    <Tabs
                        defaultActiveKey={defaultActiveKey}
                        transition={false}
                        id="noanim-tab-example"
                        className="mb-5 activity-subtab"
                    >
                        <Tab eventKey="activity_sub" title="Activity" className={defaultActiveKey=="activity_sub" ? "nav-link" : ""} onClick={(e:any)=>setdefaultActiveKey("activity_sub")}>
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
                        <Tab eventKey="notes" title="Notes" className={defaultActiveKey=="notes" ? "nav-link" : ""} onClick={(e:any)=>setdefaultActiveKey("notes")}>
                            <div className='whiteshadowbox'>
                                <div className='activityfilter-row pb-3'>
                                    <div className='createnote-row'>
                                        <button className='btn btn-primary' type='button' onClick={(e: any) => setDialogIsOpen(true)}>Create Note</button>
                                    </div>
                                </div>
                                <h3>April 2024</h3>
                                <div className='activityfilter-accrow  mb-3'>
                                    <Accordion className='activityfilter-acco'>
                                        {notesList.map((note, index) => (
                                            <Accordion.Item eventKey={"" + index} key={index}>
                                                <Accordion.Header>
                                                    <span className='accoheader-title'>
                                                        <strong>Note</strong> by {note.userName}
                                                    </span>
                                                    <span className='accoheader-date'>{moment(note.createdDate).format("MM-DD-YYYY hh:mm:ss a")}</span>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {note.noteDetails.replace(/<[^>]+>/g, '')}
                                                </Accordion.Body>
                                                {/* <div className='accofooter'>
                                            First note created
                                        </div> */}
                                                {/* <div className='accofooterbtmrow'>
                                            <div className='accoaddcomment'>
                                                <a className='addcomlink'><FontAwesomeIcon icon={faCommentDots} /> <strong>Add comment</strong></a>
                                            </div>
                                            <div className='accoaddasso'>
                                                <Dropdown className='dropdown-link dropdown-accoass'>
                                                    <Dropdown.Toggle id="dropdown-accoass">1 association</Dropdown.Toggle>
                                                    <Dropdown.Menu className='dropdown-accoasslist'>
                                                        <Dropdown.Item href="#/action-1">Collapse all</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Expand all</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div> */}
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="email" title="Email">
                            Tab content for Email
                        </Tab>
                        <Tab eventKey="calls" title="Calls">
                            Tab content for Calls
                        </Tab>
                        <Tab eventKey="tasks" title="Tasks">
                            Tab content for Tasks
                        </Tab>
                    </Tabs>

                </div>
            }
            {dialogIsOpen && <NotesAddEdit dialogIsOpen={dialogIsOpen}
                dealId={dealItem.dealID}
                setDialogIsOpen={setDialogIsOpen}
                onSaveNote={(e: any) => loadNotes()} />
            }

        </>
    )
}

export default DealActivities
import React from 'react';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import { Nav, Sidenav, Toggle } from 'rsuite';
import { useNavigate } from 'react-router-dom';

export const SideBar = () => {
    const [expanded, setExpanded] = React.useState(true);
    const [activeKey, setActiveKey] = React.useState('1');
    const navigate = useNavigate();
    return (
        <div style={{ width: 240 }}>
            <Toggle
                onChange={setExpanded}
                checked={expanded}
                checkedChildren="Expand"
                unCheckedChildren="Collapse"
            />
            <hr style={{width:1330}}/>
            <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']}>
                <Sidenav.Body>
                    <Nav activeKey={activeKey} onSelect={setActiveKey}>
                        <Nav.Item eventKey="1" icon={<DashboardIcon />} onClick={(e)=>navigate("dashboard")}>
                            Dashboard
                        </Nav.Item>
                        <Nav.Item eventKey="2" icon={<GroupIcon />}>
                            Test
                        </Nav.Item>
                        <Nav.Menu placement="rightStart" eventKey="3" title="Advanced" icon={<MagicIcon />}>
                            <Nav.Item eventKey="3-1">Test</Nav.Item>
                            <Nav.Item eventKey="3-2">Test</Nav.Item>
                            <Nav.Item eventKey="3-3">Test</Nav.Item>
                            <Nav.Item eventKey="3-4">Test</Nav.Item>
                        </Nav.Menu>
                        <Nav.Menu
                            placement="rightStart"
                            eventKey="4"
                            title="Settings"
                            icon={<GearCircleIcon />}
                        >
                            <Nav.Item eventKey="4-1">Test</Nav.Item>
                            <Nav.Item eventKey="4-2">Test</Nav.Item>
                            <Nav.Item eventKey="4-3">Test</Nav.Item>
                            <Nav.Menu eventKey="4-5" title="Custom Action">
                                <Nav.Item eventKey="4-5-1">Test</Nav.Item>
                                <Nav.Item eventKey="4-5-2">Test</Nav.Item>
                            </Nav.Menu>
                        </Nav.Menu>
                    </Nav>
                </Sidenav.Body>
                <Sidenav.Toggle expanded={expanded} onToggle={expanded => setExpanded(expanded)} />
            </Sidenav>
        </div>
    );
};

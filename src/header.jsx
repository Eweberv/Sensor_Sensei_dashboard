import React from "react";

const MyHeader = () => {
    return (
        <header className={"myHeader"} style={{ height: '80px', backgroundColor: 'yellow', top: 0, left: 0, right: 0 }}>
            <div style={{ marginLeft: '20px', paddingTop: '20px', color: 'white', fontWeight: 'bold', fontSize: '30px' }}>Sensor Sensei - Dashboard</div>
        </header>
    )
}

export default MyHeader;

import React from 'react'
import { Link } from 'react-router-dom'
function Links() {
    return (
        <div>
            <Link to='1' state={'test1'}>About 1</Link>
            <Link to='2' state={'test2'}>About 2</Link>
        </div>
    )
}

export default Links

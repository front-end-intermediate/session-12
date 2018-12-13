import React from 'react';

import Sidebar from './Sidebar'
import Content from './Content'

const Body = () => (
  <div className="body">
    <Sidebar />
    <Content />
  </div>
);

export default Body
import React, { FC } from "react";
import { TestComponents } from 'src/TestComponents';
import Page from 'src/components/Page';

const Home: FC = () => {
    return (
        <Page title="Home page">
            <TestComponents />
        </Page>
    )
}

export default Home;
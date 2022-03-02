import React, { FC } from "react";
import { BuyContractComponent } from 'src/BuyContractComponent';
import Page from 'src/components/Page';

const BuyContract: FC = () => {
    return (
        <Page title="Buy Contract">
            <BuyContractComponent />
        </Page>
    )
}

export default BuyContract;
import Accordion from 'react-bootstrap/Accordion';
import { UploadInput} from './UploadInput';
import { useState } from 'react'

export function AccordionRecord({encryptionPhrase, response}) {
    console.log(response)
    
    return (
        <>
            <h4>Records</h4>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Will</Accordion.Header>
                    <Accordion.Body>
                        <hr/>
                        <UploadInput encryptionPhrase={encryptionPhrase} response={response} category="Will"></UploadInput>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Assets</Accordion.Header>
                    <Accordion.Body>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Video</Accordion.Header>
                    <Accordion.Body>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>Personal Documents</Accordion.Header>
                    <Accordion.Body>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>

    )
}
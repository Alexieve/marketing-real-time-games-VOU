import {
    CToast,
    CToastHeader,
    CToastBody,
} from '@coreui/react';

const warningToast = ({ message }) => (
    <CToast>
        <CToastHeader closeButton>
            <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
            >
                <rect width="100%" height="100%" fill="#ffcc00"></rect>
            </svg>
            <div className="fw-bold me-auto">Warning</div>
            <small>Just now</small>
        </CToastHeader>
        <CToastBody>{message}.</CToastBody>
    </CToast>
);

const successToast = (
    <CToast>
        <CToastHeader closeButton>
            <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
            >
                <rect width="100%" height="100%" fill="#28a745"></rect>
            </svg>
            <div className="fw-bold me-auto">Success</div>
            <small>Just now</small>
        </CToastHeader>
        <CToastBody>Event {(eventId === undefined) ? 'created' : 'edited'} successfully!</CToastBody>
    </CToast>
);

const ErrorToast = ({ message }) => (
    <CToast>
        <CToastHeader closeButton>
            <svg
                className="rounded me-2"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
                focusable="false"
                role="img"
            >
                <rect width="100%" height="100%" fill="#dc3545"></rect>
            </svg>
            <div className="fw-bold me-auto">Error</div>
            <small>Just now</small>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
    </CToast>
);
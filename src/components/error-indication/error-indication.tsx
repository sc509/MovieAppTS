import {Alert, Space} from "antd";

import "./error-indication.scss";

const ErrorIndication = function () {
    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <Alert message="Ошибка" description="К сожалению, данный  сервис сейчас недоступен." type="error" closable />
        </Space>
    )
}

export default ErrorIndication;

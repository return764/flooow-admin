import React, {useState} from 'react';
import {App, Button, Form, Modal} from "antd";
import GraphList from "../../components/graphList";
import Api from "../../api";
import {Input} from "antd/lib";
import {AxiosError} from "axios";
import useEmit from "../../hooks/useEmit";

function Dashboard() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const {message} = App.useApp();
    const emitter = useEmit('graph-list-change')

    const handleOk = async () => {
        try {
            setLoading(true)
            await form.validateFields()
            await Api.graph.addGraph(form.getFieldsValue())
            setLoading(false)
            setOpen(false)
            emitter()
            message.success("create graph successfully!")
        } catch (e) {
            if (e instanceof AxiosError) {
                message.error(e.message)
            }
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setOpen(false)
        setLoading(false)
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)}>New Draw</Button>
            <Modal
                title="New Draw"
                open={open}
                onOk={handleOk}
                confirmLoading={loading}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    labelWrap={true}
                >
                    <Form.Item name="name" label="Graph Name" rules={[{ required: true }]}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
            <GraphList/>
        </div>
    );
}

export default Dashboard;

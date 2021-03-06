import { Col, Container, Row } from "react-bootstrap";
import '../../css/Tutorial.css'
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'
import 'github-markdown-css/github-markdown-light.css'
import markdownText from "./TutorialMd";

function Tutorial() {
    return (
        <Container className="tutorial-container">
            <Row className="align-items-centre justify-content-center">
                <Col md={12}>
                    <div className="markdown-body">
                        <ReactMarkdown linkTarget="_blank" rehypePlugins={[rehypeRaw]}>{markdownText}</ReactMarkdown>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Tutorial;
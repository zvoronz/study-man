import React from 'react';
import Answer from './Answer'
import {
    Card, CardBody, CardText, CardHeader, Collapse
  } from'reactstrap';
  

class Question extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            answers: props.answers,
            open: props.isCorrect !== undefined ? !props.isCorrect : true
        };
    }

    handleAnswerClick = (key) => {
        let answers = this.state.answers;

        for (let i = 0; i < answers.length; ++i) {
            if (key === answers[i].key) {
                
                answers[i]['isSelected'] = !answers[i]['isSelected'];
            }
        }
        this.props.onQuestionAnswered(this.props.bookletId, answers);
        this.setState({answers:answers});
    }

    render() {
        const {question, answers, index, bookletId, isStatic, isCorrect} = this.props;
        const {open} = this.state;
        return (
            <Card className={(isStatic ? 'my-1' : 'my-5') + ' mx-auto wa-900px'}>
                <CardBody>
                    <CardHeader aria-expanded={open}
                                aria-controls='collapse-card-text'
                                onClick={() => this.setState({'open':!open})}
                                className={(isStatic ? 'mb-1' : '') + (isCorrect ? ' bg-success' : '')}>
                        <span dangerouslySetInnerHTML={{__html:'<strong>' + index + '. ' + question + '</strong>'}} />
                        <p className={(!isStatic ? 'd-none ' : '') + 'text-danger text-right mb-0'}>
                            Question #{bookletId} in booklet!
                        </p>
                    </CardHeader>
                    <Collapse isOpen={isStatic ? open : true}>
                        <CardText id='collapse-card-text' className='d-flex flex-column animated fadeOutUp delay-5s'>
                            {answers.map(item => <Answer key={item.key}
                                                        answer={item.body}
                                                        answerId={item.key}
                                                        isCorrect={item.isCorrect}
                                                        isSelected={item.isSelected}
                                                        handleAnswer={this.handleAnswerClick} 
                                                        showAnswers={isStatic} />)}
                        </CardText>
                    </Collapse>
                </CardBody>
            </Card>
        );
    }
}

export default Question;
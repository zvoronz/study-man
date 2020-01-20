import React from 'react';
import Answer from './Answer'
import {
    Card,CardBody,CardText, CardHeader
  } from'reactstrap';
  

class Question extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            answers: props.answers
        };
    }

    handleAnswerClick = (key) => {
        let answers = this.state.answers;

        for (let i = 0; i < answers.length; ++i) {
            if (key === answers[i].key) {
                
                answers[i]['isSelected'] = !answers[i]['isSelected'];
            }
        }
        this.props.onQuestionAnswered(this.props.index, answers);
        this.setState({answers:answers});
    }

    render()
    {
        const {question, answers, index} = this.props;
        return (
            <Card className='mx-auto my-5 wa-900px'>
                <CardBody>
                    <CardHeader><span dangerouslySetInnerHTML={{__html:'<strong>'+ index + '. ' + question + '</strong>'}} /></CardHeader>
                    <CardText className='d-flex flex-column'>
                        {answers.map(item => <Answer key={item.key}
                                                     answer={item.body}
                                                     answerId={item.key}
                                                     isCorrect={item.isCorrect}
                                                     isSelected={item.isSelected}
                                                     handleAnswer={this.handleAnswerClick} />)}
                    </CardText>
                </CardBody>
            </Card>)
    }
}

export default Question;
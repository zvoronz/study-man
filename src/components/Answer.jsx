import React from 'react';
import {
    Button
  } from'reactstrap';

class Answer extends React.Component
{
    constructor()
    {
        super();

        this.state = {};
    }

    onAnswerSelected = () => {
        this.props.handleAnswer(this.props.answerId)
    }

    render()
    {
        const {answer, isSelected} = this.props;

        return (<Button outline={!isSelected}
                        color={isSelected ? 'primary' : 'secondary'}
                        className='mt-1'
                        onClick={this.onAnswerSelected}>
                    <span dangerouslySetInnerHTML={{__html:answer}} />
                </Button>)
    }

}

export default Answer;
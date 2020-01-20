import React from 'react';
import './App.css';
import chemicalBooklet from './chemicalBooklet';
import Question from './components/Question';
import { Button, Card, CardTitle, Input,
         InputGroup, InputGroupAddon }
from 'reactstrap';
import Switch from 'react-switch';

function getQuestionWith4Answers(index) {  
  let question = chemicalBooklet.questions[index];
  let answers = [];
  debugger;
  for(let i = 0; i < 4;) {
    let answer = question.answers[Math.floor(Math.random() * question.answers.length)];
    if (answers.find((element) => element.key === answer.key) === undefined) {
      ++i;
      answer['isSelected'] = false;
      answers.push(answer);
    }
  }
  question.answers = answers;
  return question;
}

function getNQuestions(amount) {
  let questions = [];
  for(let i = 0; i < amount;) {
    let question = getQuestionWith4Answers(Math.floor(Math.random() * chemicalBooklet.questions.length));
    if (questions.find((element) => element.key === question.key) === undefined) {
      ++i;
      questions.push(question);
    }
  }
  return questions;
}

function getRangedQuestions(start, end) {
  let questions = [];
  for(let i = start - 1; i < end; ++i) {
    let question = getQuestionWith4Answers(i);
    questions.push(question);
  }
  return questions;
}

class App extends React.Component {
  questions = [];

  currentRender = () => {return('');}

  constructor() {
    super();
    this.currentRender = this.renderMainMenu;
    this.state = {checked: false, first:0, last:0, questions:0};
  }

  onQuestionAnswered = (key, answers) => {
    for (let i = 0; i < this.questions.length; ++i) {
      if (key === this.questions[i].key) {
        this.questions[i]['answers'] = answers;
        console.log(this.questions[i]);
      }
    }
  }

  renderQuiz = () => {
    return (
      <div className='content'>
        <Card className='mx-auto mt-5 wa-900px'>
          <CardTitle className='text-center h1'>Chemical Quiz 2020</CardTitle>
        </Card>
        {this.questions.map(item => <Question key={item.key}
                                            index={item.key}
                                            question={item.body}
                                            answers={item.answers}
                                            onQuestionAnswered={this.onQuestionAnswered}/>)}
        <div className='d-flex flex-column'>
          <Button color='success mx-auto mb-5 wa-900px'>Result</Button>
        </div>
      </div>
    );
  }

  handleChange = () => {
    let newState = {checked: !this.state.checked}
    this.setState(newState);
  }

  onSpinChange = (event) => {
    let value = event.currentTarget.value;
    let newState = {};
    newState[event.currentTarget.id] = parseInt(value);
    this.setState(newState);
  }

  f = () => {
    if (this.state.checked) {
      return (<><Input id='first' value={this.state.first ? this.state.first : ''} placeholder='# First Q' min={1} max={749} type='number' step='1' onChange={this.onSpinChange} />
              <Input id='last' value={this.state.last ? this.state.last : ''}placeholder='# Last Q' min={2} max={750} type='number' step='1' onChange={this.onSpinChange} /></>);
    }
    else {
      return (<Input id='questions' value={this.state.questions ? this.state.questions : ''} placeholder='# Questions' min={1} max={100} type='number' step='1' onChange={this.onSpinChange}/>);
    }
  }

  renderMainMenu = () => {
    return (
      <div className='content mx-auto wa-900px'>
        <Card className='mt-5'>
          <CardTitle className='text-center h1'>Chemical Quiz 2020</CardTitle>
          <InputGroup className='my-5'>
            <Switch
              checked={this.state.checked}
              onChange={this.handleChange}
              onColor='#86d3ff'
              onHandleColor='#2693e6'
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
              activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
              height={20}
              width={48}
              className='react-switch'
              id='material-switch'
            />
            <InputGroupAddon addonType='prepend'>Deck of 750 questions</InputGroupAddon>
            {this.f()}
          </InputGroup>
          <Button color='primary' disabled={(this.state.checked && this.state.last <= this.state.first) || (!this.state.checked && this.state.questions <= 0)} 
            onClick={() => {
              if (this.state.checked) {
                this.questions = getRangedQuestions(this.state.first, this.state.last);
              }
              else {
                this.questions = getNQuestions(this.state.questions)
              }
              this.currentRender = this.renderQuiz;
              this.setState({});}}>
            Start
          </Button>
        </Card>
      </div>
    );
  }

  render() {
    return this.currentRender();
  }
}

export default App;

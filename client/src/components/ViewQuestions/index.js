import React, { useState, useEffect } from "react";
import { useStateContext } from "../../utils/GlobalState";
import API from "../../utils/API";
import "./viewQuestions.css";

const ViewQuestions = () => {

    // need global state to get the id for the current quiz
    const [state, dispatch] = useStateContext();

    // count will be used to keep track of which question(index) the user is on
    const [count, setCount] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [questionsId, setQuestionsId] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({});

    // get quiz from db and set questions to state
    const getQuiz = async (id) => {
        // get quiz info from db
        const quiz = await API.getQuiz(id);
        // set array of question ids
        setQuestionsId(quiz.data[0].questions);
        // set initial question
        getQuestion(quiz.data[0].questions[count])
    };

    // get question from db and set to state
    const getQuestion = async (id) => {
        const question = await API.getQuestions(id);
        setCurrentQuestion(question.data[0]);
    };

    // use this to set active answer in GlobalState
    const makeActive = (value) => {
        dispatch({
            type: "activeAnswer",
            activeAnswer: value
        });
    };

    // TODO - end page when all questions are answered
    const submitAnswer = () => {
        console.log("submit clicked");

        // get current answer from dom
        let answer = document.getElementById(state.activeAnswer).textContent;
  
        // if answer is correct update correct
        if (answer === currentQuestion.answer) {
            const newCorrect = correct + 1;
            setCorrect(newCorrect);
        }

        const updateCount = count + 1;

        // redirect if all questions answered
        if (updateCount === questionsId.length) {
            console.log("all done");
            window.location = "/home";
        }

        setCount(updateCount);
        getQuestion(questionsId[updateCount]);
    };

    useEffect(() => {
        getQuiz(state.currentQuiz);
    }, []);

    return (
        <div className="container questionForm">

            <div className="row justify-content-center">
                <h2>{currentQuestion.question}</h2>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="container">
                        <div className="row justify-content-center">
                            { state.activeAnswer === "a" ? <p id="a" className="text-warning">{currentQuestion.choiceA}</p> : <p id="a" onClick={() => {makeActive("a")}}>{currentQuestion.choiceA}</p> }
                        </div>
                        <div className="row justify-content-center">
                            { state.activeAnswer === "c" ? <p id="c" className="text-warning">{currentQuestion.choiceC}</p> : <p id="c" onClick={() => {makeActive("c")}}>{currentQuestion.choiceC}</p> }
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="container">
                        <div className="row justify-content-center">
                            { state.activeAnswer === "b" ? <p id="b" className="text-warning">{currentQuestion.choiceB}</p> : <p id="b" onClick={() => {makeActive("b")}}>{currentQuestion.choiceB}</p> }
                        </div>
                        <div className="row justify-content-center">
                            { state.activeAnswer === "d" ? <p id="d" className="text-warning">{currentQuestion.choiceD}</p> : <p id="d" onClick={() => {makeActive("d")}}>{currentQuestion.choiceD}</p> }
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <button type="button" className="btn btn-primary" onClick={submitAnswer}>
                    <i className="fas fa-search">Submit Answer</i>
                </button>
            </div>

        </div>
    );
};

export default ViewQuestions;
class QuestionManager{
    private questions:Array<string> = [];

    private answers:Array<string> = [];

    addQuestion(question:string){
        this.questions.push(question);
    }

    getQuestion():Array<string>{
        return this.questions;
    }

    addAnswer(answers:string){
        this.answers.push(answers);
    }

    getAnswer():Array<string>{
        return this.answers;
    }
}

export let questionManager:QuestionManager = new QuestionManager();
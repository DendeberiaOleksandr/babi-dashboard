import QuestionForm from '@/components/QuestionForm'
import QuestionsTree from '@/components/QuestionsTree'
import React from 'react'

function QuestionsPage() {
  return (
    <div className='flex flex-1 flex-col'>
        <QuestionForm/>
        <QuestionsTree/>
    </div>
  )
}

export default QuestionsPage
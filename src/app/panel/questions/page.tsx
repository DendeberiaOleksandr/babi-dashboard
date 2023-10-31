import QuestionForm from '@/components/QuestionForm'
import QuestionsGrid from '@/components/QuestionsGrid'
import React from 'react'

function QuestionsPage() {
  return (
    <div className='flex flex-1 flex-col'>
        <QuestionForm/>
        <QuestionsGrid/>
    </div>
  )
}

export default QuestionsPage
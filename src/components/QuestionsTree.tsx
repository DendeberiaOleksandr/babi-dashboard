"use client";
import {
  Question,
  QuestionUpdate,
  useGetQuestionsQuery,
  useUpdateQuestionsMutation,
} from "@/slices/questionSlice";
import React, { useCallback, useEffect, useState } from "react";
import { useGetCategoriesQuery } from "@/slices/categorySlice";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ColorRing } from "react-loader-spinner";
import QuestionTreeUpdateForm from "./QuestionTreeUpdateForm";
import { useSession } from "next-auth/react";
import axios from "axios";
import { flushSync } from "react-dom";

type UnlinkQuestion = {
  id: number;
  prevId: number;
};

type QuestionIdImageId = {
  questionId: number;
  imageId: number;
};

function QuestionsTree() {
  const {
    data: questions,
    error: questionsError,
    isLoading: isQuestionsLoading,
  } = useGetQuestionsQuery();
  const {
    data: categories,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategoriesQuery();
  const [updateQuestions] = useUpdateQuestionsMutation();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [updatedQuestionsId, setUpdatedQuestionsId] = useState<number[]>([]);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updatedQuestions, setUpdatedQuestions] = useState<QuestionUpdate[]>(
    []
  );
  const [selectedQiestions, setSelectedQiestions] = useState<UnlinkQuestion[]>(
    []
  );
  const [isUnlinked, setIsUnlinked] = useState<boolean>(false);
  const [defaultEdges, setDefaultEdges] = useState<Edge[]>([]);
  const [selectedQuestionCard, setSelectedQuestionCard] = useState<Question>();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (selectedQiestions && selectedQiestions.length > 0) {
      setIsUnlinked(true);
    } else {
      setIsUnlinked(false);
    }
  }, [selectedQiestions]);

  useEffect(() => {
    if (questions) {
      const nodes = getQuestionNodes();
      setNodes(nodes);
    }
  }, [isQuestionsLoading, isCategoriesLoading, questions, categories]);

  useEffect(() => {
    if (!isUpdated && updatedQuestionsId.length > 0) {
      setIsUpdated(true);
    }
  }, [updatedQuestionsId]);

  useEffect(() => {
    if (questions) {
      const edgs: Edge[] = [];
      questions.forEach((question) =>
        question.previousQuestionsId.forEach((prevId) =>
          edgs.push({
            id: `${prevId}-${question.id}`,
            source: prevId.toString(),
            target: question.id.toString(),
          })
        )
      );
      setEdges(edgs);
    }
  }, [questions]);

  const getQuestionNodes = (): Node[] => {
    return questions?.map<Node>((question) => ({
      id: question.id.toString(),
      position: {
        x: question.x,
        y: question.y,
      },
      data: {
        label: question.text,
      },
    }))!;
  };

  const onConnect = useCallback(
    (params: any) => {
      const id = +params.target;
      const prevId = +params.source;
      if (questions) {
        const question = questions.find((question) => question.id === id);
        if (question && !question.previousQuestionsId.includes(prevId)) {
          if (!updatedQuestionsId.includes(id)) {
            setUpdatedQuestions([
              ...updatedQuestions,
              {
                ...question,
                previousQuestionsId: [...question.previousQuestionsId, prevId],
              },
            ]);
            setUpdatedQuestionsId([...updatedQuestionsId, id]);
          } else {
            const newUpdatedQuestion = updatedQuestions.find(
              (updQuestion) => updQuestion.id === id
            );
            if (
              newUpdatedQuestion &&
              !newUpdatedQuestion.previousQuestionsId.includes(prevId)
            ) {
              const newUpdatedQuestions = updatedQuestions.filter(
                (updatedQuestion) => updatedQuestion.id !== id
              );
              setUpdatedQuestions([
                ...newUpdatedQuestions,
                {
                  ...newUpdatedQuestion,
                  previousQuestionsId: [
                    ...newUpdatedQuestion.previousQuestionsId,
                    prevId,
                  ],
                },
              ]);
            }
          }
        }
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, questions, updatedQuestions, updatedQuestionsId]
  );

  const handleUpdate = () => {
    setUpdating(true);
    
    updateQuestions(updatedQuestions)
      .then((res) => {})
      .finally(() => {
        setUpdating(false);
        setIsUpdated(false);
        setUpdatedQuestionsId([]);
        setSelectedQuestionCard(undefined);
        setUpdatedQuestions([]);
        setSelectedQiestions([]);
      });
  };

  const handleUnlink = () => {
    selectedQiestions.forEach((selectedQiestion) => {
      const updatedQuestion = updatedQuestions.find(
        (updatedQuestion) => updatedQuestion.id === selectedQiestion.id
      );
      if (updatedQuestion) {
        const newUpdatedQuestions = updatedQuestions.filter(
          (q) => q.id !== updatedQuestion.id
        );
        setUpdatedQuestions([
          ...newUpdatedQuestions,
          {
            ...updatedQuestion,
            previousQuestionsId: updatedQuestion.previousQuestionsId.filter(
              (prevId) => prevId !== selectedQiestion.prevId
            ),
          },
        ]);
      } else {
        const question = questions?.find(
          (question) => question.id === selectedQiestion.id
        );
        if (question) {
          setUpdatedQuestions([
            ...updatedQuestions,
            {
              ...question,
              previousQuestionsId: question.previousQuestionsId.filter(
                (prevId) => prevId !== selectedQiestion.prevId
              ),
            },
          ]);
        }
      }
      setUpdatedQuestionsId([...updatedQuestionsId, selectedQiestion.id]);
      setEdges(
        edges.filter(
          (edge) =>
            edge.target !== selectedQiestion.id.toString() ||
            edge.source !== selectedQiestion.prevId.toString()
        )
      );
      setSelectedQiestions(
        selectedQiestions.filter(
          (sq) =>
            sq.id !== selectedQiestion.id &&
            sq.prevId !== selectedQiestion.prevId
        )
      );
    });
  };

  return (
    <div
      className="relative border-2 border-primary"
      style={{
        width: "100%",
        height: "850px",
      }}
    >
      <ReactFlow
        onNodeClick={(event, node) => {
          setSelectedQuestionCard(
            questions?.find((question) => question.id === +node.id)
          );
        }}
        defaultEdges={defaultEdges}
        nodes={nodes}
        edges={edges}
        onPaneClick={() => setSelectedQiestions([])}
        onEdgeClick={(event, node) => {
          const id = +node.target;
          const prevId = +node.source;
          const selectedQuestion = selectedQiestions.find(
            (selectedQuestion) =>
              selectedQuestion.id === id && selectedQuestion.prevId === prevId
          );
          if (!selectedQuestion) {
            setSelectedQiestions([
              ...selectedQiestions,
              {
                id: id,
                prevId: prevId,
              },
            ]);
          } else {
            setSelectedQiestions(
              selectedQiestions.filter(
                (selectedQiestion) =>
                  selectedQiestion.id !== id &&
                  selectedQiestion.prevId !== prevId
              )
            );
          }
        }}
        onConnect={onConnect}
        onNodeDragStop={(event, node, nodes: any[]) => {
          const id = +node.id;
          const updatedQuestion = updatedQuestions.find((q) => q.id === id);
          if (!updatedQuestion) {
            const question = questions?.find((question) => question.id === id);
            if (question) {
              setUpdatedQuestions([
                ...updatedQuestions,
                {
                  ...question,
                  x: node.position.x,
                  y: node.position.y,
                },
              ]);
            }
          } else {
            const newupdatedQuestion = updatedQuestions.find(
              (updatedQuestion) => updatedQuestion.id === id
            );
            const newUpdatedQuestions = updatedQuestions.filter(
              (updatedQuestion) => updatedQuestion.id !== id
            );
            if (newupdatedQuestion) {
              setUpdatedQuestions([
                ...newUpdatedQuestions,
                {
                  ...newupdatedQuestion,
                  x: node?.position.x,
                  y: node?.position.y,
                },
              ]);
            }
          }
          setUpdatedQuestionsId([...updatedQuestionsId, id])
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <div className="z-50 bg-white flex flex-col items-center shadow-md shadow-primary w-[360px] h-full absolute right-0 bottom-0">
          <div className="flex flex-row items-center py-4 gap-2 justify-center">
            <button
              onClick={() => handleUpdate()}
              disabled={!isUpdated || updating}
              className={`px-4 py-2 rounded-md text-white text-center flex flex-row justify-center transition-colors duration-200 ${
                isUpdated
                  ? "bg-green-500 cursor-pointer hover:bg-green-600"
                  : "bg-green-300 opacity-40"
              }`}
            >
              {updating ? (
                <ColorRing
                  visible={true}
                  height={24}
                  width={24}
                  colors={["#eee", "#eee", "#eee", "#eee", "#eee"]}
                />
              ) : (
                "Update"
              )}
            </button>
            <button
              onClick={() => handleUnlink()}
              disabled={!isUnlinked}
              className={`px-4 py-2 rounded-md text-white transition-colors duration-200 ${
                isUnlinked
                  ? "bg-red-500 cursor-pointer hover:bg-red-600"
                  : "bg-red-300 opacity-40"
              }`}
            >
              Unlink
            </button>
          </div>

          {selectedQuestionCard && (
            <QuestionTreeUpdateForm
              setSelectedCategoriesId={(selectedCategories: number[]) => {
                if (selectedCategories.length < 1) {
                  return;
                }
                const updatedQuestion = updatedQuestions.find(
                  (q) => q.id === selectedQuestionCard.id
                );
                if (updatedQuestion) {
                  const newUpdatedQuestions = updatedQuestions.filter(
                    (q) => q.id !== updatedQuestion.id
                  );
                  setUpdatedQuestions([
                    ...newUpdatedQuestions,
                    {
                      ...updatedQuestion,
                      categoriesId: selectedCategories,
                    },
                  ]);
                } else {
                  setUpdatedQuestions([
                    ...updatedQuestions,
                    {
                      ...selectedQuestionCard,
                      categoriesId: selectedCategories,
                    },
                  ]);
                }
                setUpdatedQuestionsId([
                  ...updatedQuestionsId,
                  selectedQuestionCard.id,
                ]);
              }}
              setText={(text: string) => {
                const updatedQuestion = updatedQuestions.find(
                  (q) => q.id === selectedQuestionCard.id
                );
                if (updatedQuestion) {
                  const newUpdatedQuestions = updatedQuestions.filter(
                    (q) => q.id !== updatedQuestion.id
                  );
                  setUpdatedQuestions([
                    ...newUpdatedQuestions,
                    {
                      ...updatedQuestion,
                      text: text,
                    },
                  ]);
                } else {
                  setUpdatedQuestions([
                    ...updatedQuestions,
                    {
                      ...selectedQuestionCard,
                      text: text,
                    },
                  ]);
                }
                setUpdatedQuestionsId([
                  ...updatedQuestionsId,
                  selectedQuestionCard.id,
                ]);
              }}
              setIconId={(iconId: number) => {
                const updatedQuestion = updatedQuestions.find(
                  (q) => q.id === selectedQuestionCard.id
                );
                if (updatedQuestion) {
                  const newUpdatedQuestions = updatedQuestions.filter(
                    (q) => q.id !== updatedQuestion.id
                  );
                  setUpdatedQuestions([
                    ...newUpdatedQuestions,
                    {
                      ...updatedQuestion,
                      iconId: iconId,
                    },
                  ]);
                } else {
                  setUpdatedQuestions(prevState => [
                    ...prevState,
                    {
                      ...selectedQuestionCard,
                      iconId: iconId,
                    },
                  ]);
                }
                setUpdatedQuestionsId(prevState => [
                  ...prevState,
                  selectedQuestionCard.id,
                ]);
              }}
              getQuestion={() => {
                const updatedQuestion = updatedQuestions.find(
                  (q) => q.id === selectedQuestionCard.id
                );
                if (updatedQuestion) {
                  console.log(updatedQuestion)
                  return updatedQuestion;
                } else {
                  return selectedQuestionCard;
                }
              }}
            />
          )}
        </div>
      </ReactFlow>
    </div>
  );
}

export default QuestionsTree;

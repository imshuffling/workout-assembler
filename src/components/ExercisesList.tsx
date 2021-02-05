// @ts-nocheck
import { React, useState, useEffect } from "react";
import {
  Button,
  EditorToolbarButton,
  SkeletonBodyText,
  SkeletonContainer,
  TextInput,
  Paragraph,
  Grid,
  Flex,
  Option,
  Select,
  Subheading,
  FormLabel,
} from "@contentful/forma-36-react-components";
import { FieldExtensionSDK } from "contentful-ui-extensions-sdk";
// import { isConstructSignatureDeclaration } from "typescript";
// import { findByDisplayValue } from "@testing-library/react";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

// TODO
// Reps or time boolean

const ExercisesList = (props: FieldProps) => {
  const fieldValue = props.sdk.field.getValue();
  const [exercises, setExercises] = useState(fieldValue || []);

  // use contentful's builtin auto-resizer
  useEffect(() => {
    props.sdk.window.startAutoResizer();
  });

  // check for unresolved names and fetch them from contenful if neccessary
  useEffect(() => {
    const exercisesWithoutName = exercises.filter((exercise) => !exercise.name);
    if (!exercisesWithoutName.length) {
      return;
    }

    const ids = exercises.map((exercise) => exercise.id);
    props.sdk.space.getEntries({ "sys.id[in]": ids }).then((queryResult) => {
      let populatedExercises = exercises.map((exercise) => {
        const resultForCurrentExercise = queryResult.items
          .filter((entry) => entry.sys.id === exercise.id)
          .pop();

        console.log("resultForCurrentExercise ", resultForCurrentExercise);

        return {
          name: resultForCurrentExercise
            ? resultForCurrentExercise.fields.title["en-US"]
            : "",
          cardio: resultForCurrentExercise
            ? resultForCurrentExercise.fields.cardio["en-US"]
            : "",
          thumbnail: resultForCurrentExercise.fields.vixy
            ? resultForCurrentExercise.fields.vixy["en-US"]
            : undefined,
          ...exercise,
        };
      });
      setExercises(populatedExercises);
    });
  }, [exercises, props.sdk.space]);

  // update contentful field value whenever exercises data changes
  useEffect(() => {
    const sanitizedExercises = exercises.map((exercise) => {
      console.log("exercise ", exercise);
      return {
        title: exercise.name,
        cardio: exercise.cardio,
        id: exercise.id,
        note: exercise.note,
        duration: [
          exercise.duration[0] ? exercise.duration[0] : "",
          exercise.duration[1] ? exercise.duration[1] : "",
          exercise.duration[2] ? exercise.duration[2] : "",
        ],
        rest: [
          exercise.rest[0] ? exercise.rest[0] : "",
          exercise.rest[1] ? exercise.rest[1] : "",
          exercise.rest[2] ? exercise.rest[2] : "",
          exercise.rest[3] ? exercise.rest[3] : "",
          exercise.rest[4] ? exercise.rest[4] : "",
          exercise.rest[5] ? exercise.rest[5] : "",
          exercise.rest[6] ? exercise.rest[6] : "",
          exercise.rest[7] ? exercise.rest[7] : "",
          exercise.rest[8] ? exercise.rest[8] : "",
          exercise.rest[9] ? exercise.rest[9] : "",
        ],
        reps: [
          exercise.reps[0] ? exercise.reps[0] : "",
          exercise.reps[1] ? exercise.reps[1] : "",
          exercise.reps[2] ? exercise.reps[2] : "",
          exercise.reps[3] ? exercise.reps[3] : "",
          exercise.reps[4] ? exercise.reps[4] : "",
          exercise.reps[5] ? exercise.reps[5] : "",
          exercise.reps[6] ? exercise.reps[6] : "",
          exercise.reps[7] ? exercise.reps[7] : "",
          exercise.reps[8] ? exercise.reps[8] : "",
          exercise.reps[9] ? exercise.reps[9] : "",
        ],
        time: exercise.time,
        cardioRest: exercise.cardioRest,
        intensity: exercise.intensity,
        kcal: exercise.kcal,
        distance: exercise.distance,
        // additonal fields for cardio
      };
    });
    props.sdk.field.setValue(sanitizedExercises);
  }, [exercises, props.sdk.field]);

  // open entry selection dialog and append selected entries to the end of our list
  const onAddButtonClicked = () => {
    props.sdk.dialogs
      .selectMultipleEntries({ contentTypes: ["exercise"] })
      .then((selectedExercises) => {
        setExercises([
          ...exercises,
          ...selectedExercises.map((exercise) => {
            console.log("...exercises", ...exercises);
            return {
              title: exercise.name,
              id: exercise.sys.id,
              key: `${exercise.sys.id}-${Math.floor(Math.random() * 100000)}`,
              time: "",
              reps: [],
              rest: [],
              intensity: "",
              distance: "",
              cardioRest: "",
              duration: [],
              kcal: "",
              note: "",
            };
          }),
        ]);
        props.sdk.field.setValue(exercises);
      })
      .catch(() => {
        /* do nothing */
      });
  };

  // update exercises with new amount
  const onChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const repIndex = e.target.dataset.repindex;
    const restIndex = e.target.dataset.restindex;
    // const cardioIndex = e.target.dataset.cardioindex;
    const updatedExercises = [...exercises];
    if (repIndex > -1) {
      updatedExercises[exerciseIndex].reps[repIndex] = e.target.value;
    } else {
      updatedExercises[exerciseIndex].rest[restIndex] = e.target.value;
    }

    // if (repIndex > -1) {
    //   updatedExercises[exerciseIndex].reps[repIndex] = e.target.value;
    // } else if (restIndex > -1) {
    //   updatedExercises[exerciseIndex].rest[restIndex] = e.target.value;
    // } else {
    //   updatedExercises[exerciseIndex].note = e.target.value;
    //   // updatedExercises[exerciseIndex].note = e.target.value;
    // }

    setExercises(updatedExercises);
  };

  const onCardioRestChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].cardioRest = e.target.value;
    setExercises(updatedExercises);
  };

  const onIntensityChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;

    // console.log("onIntensityChanged index ", exerciseIndex);

    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].intensity = e.target.value;
    setExercises(updatedExercises);
  };

  const onNoteChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const updatedExercises = [...exercises];

    console.log("updatedExercises ", updatedExercises);

    updatedExercises[exerciseIndex].note = e.target.value;

    console.log(
      "updatedExercises.note = e.target.value; ",
      (updatedExercises.note = e.target.value)
    );

    setExercises(updatedExercises);
  };

  const onKcalChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].kcal = e.target.value;
    setExercises(updatedExercises);
  };

  const onDistanceChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].distance = e.target.value;
    setExercises(updatedExercises);
  };

  const onDurationChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const durIndex = e.target.dataset.durindex;

    // console.log("e.target.dataset.index", e.target.dataset.index);
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].duration[durIndex] = e.target.value;
    setExercises(updatedExercises);
  };

  const ontimeExerciseChanged = (e) => {
    const exerciseIndex = e.target.dataset.index;
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].time = e.target.checked;
    setExercises(updatedExercises);
  };

  // remove exercise from list
  const onDeleteButtonClicked = (e) => {
    let actualTarget = e.target;
    while (!actualTarget.dataset.index || actualTarget.id === "root") {
      actualTarget = actualTarget.parentNode;
    }
    if (actualTarget.id === "root") {
      return;
    }
    const exerciseIndex = parseInt(actualTarget.dataset.index);
    const updatedExercises = exercises.filter(
      (_, index) => index !== exerciseIndex
    );
    setExercises(updatedExercises);
  };

  // console.log(exercises);
  return (
    <section>
      <div className="exercises">
        {exercises.map((exercise, index) => {
          if (exercise.cardio === true) {
            return (
              <div className="exercise__item" key={exercise.key}>
                <Grid className="exercise__item_header" columns={2} rows={1}>
                  {exercise.name ? (
                    <Subheading>{exercise.name}</Subheading>
                  ) : (
                    <SkeletonContainer svgHeight="20">
                      <SkeletonBodyText numberOfLines="1"></SkeletonBodyText>
                    </SkeletonContainer>
                  )}
                  <div className="close">
                    <EditorToolbarButton
                      icon="Delete"
                      data-index={index}
                      onClick={onDeleteButtonClicked}
                    ></EditorToolbarButton>
                  </div>
                </Grid>

                <Grid columns={3}>
                  {exercise.thumbnail && (
                    <img
                      className="vixy-thumb"
                      alt="Vixy thumbnail"
                      src={`https://static.cdn.vixyvideo.com/p/380/sp/38000/thumbnail/entry_id/${exercise.thumbnail}`}
                    />
                  )}
                  <div>
                    <FormLabel>Duration</FormLabel>
                    <Flex alignItems={"center"}>
                      <TextInput
                        value={exercise.duration[0]}
                        data-durindex={0}
                        data-index={index}
                        placeholder={"HH"}
                        onChange={onDurationChanged}
                      ></TextInput>
                      {" : "}
                      <TextInput
                        value={exercise.duration[1]}
                        data-durindex={1}
                        data-index={index}
                        placeholder={"MM"}
                        onChange={onDurationChanged}
                      ></TextInput>
                      {" : "}
                      <TextInput
                        value={exercise.duration[2]}
                        data-durindex={2}
                        data-index={index}
                        placeholder={"SS"}
                        onChange={onDurationChanged}
                      ></TextInput>
                    </Flex>
                  </div>
                </Grid>

                <Grid
                  columns={3}
                  columnGap={"spacingM"}
                  rowGap={"spacingXs"}
                  className="cardio-container"
                >
                  <div>
                    <FormLabel>Distance</FormLabel>
                    <TextInput
                      value={exercise.distance}
                      data-index={index}
                      onChange={onDistanceChanged}
                      placeholder={"Km"}
                    ></TextInput>
                  </div>
                  <div>
                    <FormLabel>Rest</FormLabel>
                    <TextInput
                      value={exercise.cardioRest}
                      data-index={index}
                      onChange={onCardioRestChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <FormLabel>Kcal</FormLabel>
                    <TextInput
                      value={exercise.kcal}
                      data-index={index}
                      onChange={onKcalChanged}
                      placeholder={"Kcal"}
                    ></TextInput>
                  </div>
                </Grid>

                <Grid columns={2} rows={1}>
                  <div>
                    <FormLabel>Intensity</FormLabel>
                    <Select
                      value={exercise.intensity}
                      onChange={onIntensityChanged}
                      data-index={index}
                    >
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                    </Select>
                  </div>
                  <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <FormLabel>Notes</FormLabel>
                      </div>
                      <textarea
                        className="Textarea__Textarea__textarea___30c64 a11y__focus-border--default___60AXp"
                        value={exercise.note}
                        data-index={index}
                        onChange={onNoteChanged}
                        placeholder="Notes"
                      />
                    </div>
                  </div>
                </Grid>
              </div>
            );
          } else {
            return (
              <div className="exercise__item" key={exercise.key}>
                <Grid className="exercise__item_header" columns={2} rows={1}>
                  {exercise.name ? (
                    <Subheading>{exercise.name}</Subheading>
                  ) : (
                    <SkeletonContainer svgHeight="20">
                      <SkeletonBodyText numberOfLines="1"></SkeletonBodyText>
                    </SkeletonContainer>
                  )}
                  <div className="close">
                    <EditorToolbarButton
                      icon="Delete"
                      data-index={index}
                      onClick={onDeleteButtonClicked}
                    ></EditorToolbarButton>
                  </div>
                </Grid>

                <Grid columns={3} rows={1}>
                  {exercise.thumbnail && (
                    <img
                      className="vixy-thumb"
                      alt="Vixy thumbnail"
                      src={`https://static.cdn.vixyvideo.com/p/380/sp/38000/thumbnail/entry_id/${exercise.thumbnail}`}
                    />
                  )}

                  <Flex>
                    <FormLabel style={{ display: "flex" }}>
                      <input
                        type="checkbox"
                        className="ControlledInput__ControlledInput___2XK3j"
                        data-index={index}
                        checked={exercise.time === true ? `checked` : ""}
                        value="yes"
                        onChange={ontimeExerciseChanged}
                      />
                      Time based exercise
                    </FormLabel>
                  </Flex>

                  {/* <CheckboxField
                    type="checkbox"
                    data-index={index}
                    checked={exercise.time === true ? `checked` : ""}
                    value="yes"
                    onChange={ontimeExerciseChanged}
                  /> */}
                </Grid>

                <Grid
                  columns={11}
                  rows={1}
                  rowGap={"spacingXs"}
                  columnGap={"spacingXs"}
                  className={"rep-container"}
                >
                  <div>
                    <Flex flexDirection={"column"} justifyContent={"center"}>
                      <Paragraph
                        style={{
                          marginTop: "30px",
                          textAlign: "right",
                        }}
                      >
                        Reps{exercise.time === true ? `(s)` : `(x)`}
                      </Paragraph>
                    </Flex>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      <Paragraph>1</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[0]}
                      data-index={index}
                      data-repindex={0}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      <Paragraph>2</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[1]}
                      data-index={index}
                      data-repindex={1}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>3</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[2]}
                      data-index={index}
                      data-repindex={2}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>4</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[3]}
                      data-index={index}
                      data-repindex={3}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>5</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[4]}
                      data-index={index}
                      data-repindex={4}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>6</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[5]}
                      data-index={index}
                      data-repindex={5}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>7</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[6]}
                      data-index={index}
                      data-repindex={6}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>8</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[7]}
                      data-index={index}
                      data-repindex={7}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>9</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[8]}
                      data-index={index}
                      data-repindex={8}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <Flex justifyContent={"center"}>
                      {" "}
                      <Paragraph>10</Paragraph>
                    </Flex>
                    <TextInput
                      value={exercise.reps[9]}
                      data-index={index}
                      data-repindex={9}
                      onChange={onChanged}
                    ></TextInput>
                  </div>

                  <div>
                    <Flex flexDirection={"column"} justifyContent={"center"}>
                      <Paragraph
                        style={{
                          marginTop: "10px",
                          textAlign: "right",
                        }}
                      >
                        Rest
                      </Paragraph>
                    </Flex>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[0]}
                      data-index={index}
                      data-restindex={0}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[1]}
                      data-index={index}
                      data-restindex={1}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[2]}
                      data-index={index}
                      data-restindex={2}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[3]}
                      data-index={index}
                      data-restindex={3}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[4]}
                      data-index={index}
                      data-restindex={4}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[5]}
                      data-index={index}
                      data-restindex={5}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[6]}
                      data-index={index}
                      data-restindex={6}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[7]}
                      data-index={index}
                      data-restindex={7}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[8]}
                      data-index={index}
                      data-restindex={8}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                  <div>
                    <TextInput
                      value={exercise.rest[9]}
                      data-index={index}
                      data-restindex={9}
                      onChange={onChanged}
                    ></TextInput>
                  </div>
                </Grid>

                <Grid columns={2}>
                  <div>
                    <FormLabel>Intensity</FormLabel>
                    <Select
                      value={exercise.intensity}
                      onChange={onIntensityChanged}
                      data-index={index}
                    >
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                    </Select>
                  </div>

                  <div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                        <FormLabel>Notes</FormLabel>
                      </div>
                      <textarea
                        className="Textarea__Textarea__textarea___30c64 a11y__focus-border--default___60AXp"
                        value={exercise.note}
                        data-index={index}
                        onChange={onNoteChanged}
                        placeholder="Notes"
                      />
                    </div>

                    {/* <FormLabel>Notes</FormLabel>
                    <TextInput
                      value={exercise.note}
                      data-index={index}
                      onChange={onNoteChanged}
                    ></TextInput> */}
                  </div>
                </Grid>
              </div>
            );
          }
        })}
      </div>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Button icon="Plus" buttonType="naked" onClick={onAddButtonClicked}>
          Add
        </Button>
      </div>
    </section>
  );
};

export default ExercisesList;

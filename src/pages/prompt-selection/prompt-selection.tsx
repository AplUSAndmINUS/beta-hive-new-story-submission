import React from 'react';

import NavigateButtons from 'shared/components/navigate-buttons/navigate-buttons';
import PromptCard from 'shared/components/prompt-card/prompt-card';
import Selections from 'shared/components/selections/selections';
import { useAppDispatch, useAppSelector } from 'shared/stores/store';
import {
  // setCharacterSelection,
  // setSettingSelection,
  setPromptSelections,
} from 'shared/stores/reducers/story-submission';
import { PROMPT_SELECTIONS } from 'shared/services/constants/admin-constants';
// import { CHARACTER_SELECTIONS, SETTING_SELECTIONS } from '../../services/constants/constants';

export const PromptSelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { promptSelections } = useAppSelector((state) => state.storySubmission);
  const { minPromptSelections } = useAppSelector(
    (state) => state.adminSubmission
  );

  const handlePromptSelection = (selection: string) => {
    if (promptSelections.includes(selection)) {
      dispatch(
        setPromptSelections(
          promptSelections.filter((prompt) => prompt !== selection)
        )
      );
    } else {
      dispatch(setPromptSelections([...promptSelections, selection]));
    }
  };

  // customer requested these be listed all under prompts and not separated -TW
  // const handleCharacterSelection = (character: string) => {
  //   dispatch(setCharacterSelection(character));
  // };

  // const handleSettingSelection = (setting: string) => {
  //   dispatch(setSettingSelection(setting));
  // };

  return (
    <div className='container-fluid'>
      <div className='row d-flex justify-content-between align-items-center'>
        <div className='col'>
          <h1 className='bd-title pb-2 mt-4'>Choose two prompts</h1>
          <p className='text-muted pb-2 mt-2 fs-5'>
            Select two prompts from the following prompts.
            <br />
            You'll use these to create your story.
          </p>
        </div>
        <Selections />
      </div>
      <div className='row'>
        <h3 className='pb-2 mt-3'>Prompts</h3>
        {/* {CHARACTER_SELECTIONS.map((character, index) => (
          <PromptCard
            key={character.name + index}
            prompt={character.name}
            promptText={character.description}
            handleSelection={handleCharacterSelection}
          />
        ))}
        {SETTING_SELECTIONS.map((setting, index) => (
          <PromptCard
            key={setting.name + index}
            prompt={setting.name}
            promptText={setting.description}
            handleSelection={handleSettingSelection}
          />
        ))} */}
        {PROMPT_SELECTIONS.map((prompt, index) => (
          <PromptCard
            key={prompt.name + index}
            prompt={prompt.name}
            promptText={prompt.description}
            handleSelection={handlePromptSelection}
          />
        ))}
      </div>
      <div className='row'>
        <NavigateButtons
          isNextDisabled={promptSelections.length < minPromptSelections}
          backNavigation='Beta HIVE Selection'
          nextNavigation='Story Submission'
        />
      </div>
    </div>
  );
};

export default PromptSelection;

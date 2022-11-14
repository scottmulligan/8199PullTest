import { useContext, useEffect, useRef } from 'react';
import useContentSearchQueries from '../../hooks/useContentSearchQueries';
import { ContentSearchNews } from '../../interfaces/contentSearch/ContentSearchNews';
import { ContentSearchResponse } from '../../interfaces/contentSearch/ContentSearchResponse';
import { ContentSearchSession } from '../../interfaces/contentSearch/ContentSearchSession';
import { ContentSearchSpeaker } from '../../interfaces/contentSearch/ContentSearchSpeaker';
import PreviewSearchPopup from './PreviewSearchPopup';
import { PreviewSearchContext } from './PreviewSearchContextProvider';
import { SEARCH_PAGE } from '../../helpers/ContentSearchHelper';

type PreviewSearchContainerProps = {
  close?: () => void;
};

const contentSearchSuggestionByEntity = {
  session: [{ name: 'session_name_context_aware' }],
  content: [{ name: 'content_name_context_aware' }],
  speaker: [{ name: 'speaker_name_context_aware' }],
};

const PreviewSearchContainer = ({ close }: PreviewSearchContainerProps): JSX.Element => {
  const { keyphrase } = useContext(PreviewSearchContext);
  const {
    isLoading,
    result: [news, sessions, speakers],
  } = useContentSearchQueries<
    [
      ContentSearchResponse<ContentSearchNews>,
      ContentSearchResponse<ContentSearchSession>,
      ContentSearchResponse<ContentSearchSpeaker>
    ]
  >(
    ['content', 'session', 'speaker'],
    {
      keyphrase,
      limit: 4,
      widgetId: 'rfkid_6',
    },
    {
      session: {
        search: {
          suggestion: contentSearchSuggestionByEntity.session,
        },
      },
      speaker: {
        search: {
          suggestion: contentSearchSuggestionByEntity.speaker,
        },
      },
      content: {
        search: {
          suggestion: contentSearchSuggestionByEntity.content,
        },
      },
    }
  );

  const keyphraseRef = useRef<string>();
  useEffect(() => {
    if (!isLoading) {
      keyphraseRef.current = keyphrase;
    }
  }, [isLoading, keyphrase]);

  return (
    <PreviewSearchPopup
      // we want to generate the correct search results url based on the current response keyphrase to avoid unnecessary re-renders
      resultsUrl={`${SEARCH_PAGE}?q=${keyphraseRef.current}`}
      news={news}
      sessions={sessions}
      speakers={speakers}
      close={close}
    />
  );
};

export default PreviewSearchContainer;

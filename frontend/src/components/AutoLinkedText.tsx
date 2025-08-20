import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { findEntitiesByName } from '../services/entityService';
import useProjectStore from '../store/projectStore';
import type { Entity } from '../types/entity';

interface AutoLinkedTextProps {
  text: string;
}

const AutoLinkedText: React.FC<AutoLinkedTextProps> = ({ text }) => {
  const { selectedProject } = useProjectStore();
  const [linkedEntities, setLinkedEntities] = useState<Entity[]>([]);

  useEffect(() => {
    const potentialNames = text.match(/\b([A-Z][a-z]*\s*)+\b/g) || [];
    if (selectedProject && potentialNames.length > 0) {
      findEntitiesByName(selectedProject._id, potentialNames.map(name => name.trim()))
        .then(setLinkedEntities)
        .catch(console.error);
    }
  }, [text, selectedProject]);

  const renderedText = useMemo(() => {
    if (linkedEntities.length === 0) {
      return text;
    }

    const entityNames = linkedEntities.map(e => e.name);
    const regex = new RegExp(`\\b(${entityNames.join('|')})\\b`, 'g');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const matchedEntity = linkedEntities.find(e => e.name === part);
      if (matchedEntity) {
        // This is a very simplified link, assuming a route structure like /entities/:id
        return (
          <RouterLink key={index} to={`/world-forge?entity=${matchedEntity._id}`}>
            {part}
          </RouterLink>
        );
      }
      return part;
    });
  }, [text, linkedEntities]);

  return <>{renderedText}</>;
};

export default AutoLinkedText;

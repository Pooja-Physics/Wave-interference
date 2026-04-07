import { Target } from 'lucide-react';
import { LESSON_CONFIG } from '../../lessonConfig';

interface Props {
  objectiveIndex?: number;
}

export default function ObjectiveBanner({ objectiveIndex }: Props) {
  if (objectiveIndex === undefined) return null;
  
  const objective = LESSON_CONFIG.learningObjectives[objectiveIndex];
  if (!objective) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 shadow-sm">
      <div className="p-2 bg-white rounded-lg shadow-sm border border-blue-100">
        <Target className="w-4 h-4 text-blue-600" />
      </div>
      <p className="text-sm font-bold text-blue-800">
        Objective Alignment: <span className="font-medium text-blue-700">{objective}</span>
      </p>
    </div>
  );
}

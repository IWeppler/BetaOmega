"use client";

import React, { useMemo } from "react";
import parse, { DOMNode, Element, Text } from "html-react-parser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { IGlossaryTerm } from "@/interfaces";

interface Props {
  content: string;
  terms: IGlossaryTerm[];
}

export const GlossaryRenderer = ({ content, terms }: Props) => {
  // 1. "Memoria" de este renderizado.
  // Creamos un Set vacío cada vez que el componente se renderiza.
  // Esto rastreará qué IDs de términos ya han sido convertidos a Tooltip.
  const highlightedTermIds = new Set<number>();

  const processedTerms = useMemo(() => {
    return terms.sort((a, b) => b.term.length - a.term.length);
  }, [terms]);

  if (!content) return null;
  if (processedTerms.length === 0) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose max-w-none"
      />
    );
  }

  const replaceTextWithTooltips = (
    text: string
  ): (string | React.JSX.Element)[] => {
    const parts: (string | React.JSX.Element)[] = [text];

    processedTerms.forEach((t) => {
      // 2. OPTIMIZACIÓN: Si ya resaltamos esta palabra en el texto anterior, la saltamos.
      if (highlightedTermIds.has(t.id)) return;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Solo procesamos si es texto plano (no un Tooltip ya creado)
        if (typeof part === "string") {
          const regex = new RegExp(`\\b(${t.term})\\b`, "gi");

          // Verificamos si existe al menos una coincidencia antes de hacer el split
          if (regex.test(part)) {
            const split = part.split(regex);
            const newSubParts: (string | React.JSX.Element)[] = [];

            split.forEach((subPart) => {
              const isMatch = subPart.toLowerCase() === t.term.toLowerCase();

              // 3. LÓGICA DE ÚNICA VEZ:
              if (isMatch && !highlightedTermIds.has(t.id)) {
                newSubParts.push(
                  <TooltipProvider key={t.id} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help text-indigo-600 font-medium decoration-indigo-300 underline decoration-dotted underline-offset-4 hover:text-indigo-800 transition-colors">
                          {subPart}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs bg-slate-900 text-white border-slate-800 z-50">
                        <p className="font-bold text-xs mb-1 text-indigo-300">
                          {t.term}
                        </p>
                        <p className="text-sm leading-relaxed">
                          {t.definition}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );

                // 4. MARCAR COMO USADO:
                // Agregamos el ID al Set para que no se vuelva a resaltar en el futuro
                highlightedTermIds.add(t.id);
              } else {
                // Si es match pero YA fue resaltada antes, o si es texto normal
                newSubParts.push(subPart);
              }
            });

            parts.splice(i, 1, ...newSubParts);
            i += newSubParts.length - 1;
          }
        }
      }
    });

    return parts;
  };

  const options = {
    replace: (domNode: DOMNode) => {
      if (
        domNode instanceof Text &&
        domNode.parent &&
        domNode.parent instanceof Element
      ) {
        const parentTag = domNode.parent.name;
        // Evitamos romper etiquetas interactivas
        if (
          ["a", "button", "script", "style", "h1", "h2", "h3"].includes(
            parentTag
          )
        )
          return;

        if (domNode.data && domNode.data.trim().length > 0) {
          const newContent = replaceTextWithTooltips(domNode.data);
          // Si el array resultante es igual al string original, no hubo cambios
          if (newContent.length === 1 && typeof newContent[0] === "string")
            return;
          return <>{newContent}</>;
        }
      }
    },
  };

  return (
    <div className="prose max-w-none text-slate-700 leading-relaxed">
      {parse(content, options)}
    </div>
  );
};

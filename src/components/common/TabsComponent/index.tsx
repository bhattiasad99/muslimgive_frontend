import React, { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabItem = {
  value: string
  label: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

type TabsComponentProps = {
  items: TabItem[]
  value: string
  onValueChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  listVariant?: React.ComponentProps<typeof TabsList>['variant']
  className?: string
  listClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

const TabsComponent: FC<TabsComponentProps> = ({
  items,
  value,
  onValueChange,
  orientation = 'horizontal',
  listVariant = 'default',
  className,
  listClassName,
  triggerClassName,
  contentClassName
}) => {
  return (
    <Tabs
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={className}
    >
      <TabsList variant={listVariant} className={listClassName}>
        {items.map(item => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={triggerClassName}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map(item => (
        <TabsContent
          key={item.value}
          value={item.value}
          className={contentClassName}
        >
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default TabsComponent

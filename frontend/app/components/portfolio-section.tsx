'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';
import { PortfolioComparison } from './portfolio-comparison';

interface Portfolio {
  id: number;
  name: string;
}

export function PortfolioSection() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [newPortfolioName, setNewPortfolioName] = useState('');
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isRenameDialogOpen, setRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [portfolioToRename, setPortfolioToRename] = useState<Portfolio | null>(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    const response = await fetch('/api/portfolios');
    if (response.ok) {
      const data = await response.json();
      setPortfolios(data as Portfolio[]);

      // If no portfolio is selected, or the selected one was deleted, select the first available.
      const currentSelectedId = selectedPortfolio?.id;
      if (currentSelectedId && data.some((p: Portfolio) => p.id === currentSelectedId)) {
        // Current selection is still valid, do nothing.
      } else if (data.length > 0) {
        setSelectedPortfolio(data[0]);
      } else {
        setSelectedPortfolio(null);
      }
    }
  };

  const handleCreatePortfolio = async () => {
    if (newPortfolioName.trim() !== '') {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPortfolioName.trim() }),
      });
      if (response.ok) {
        fetchPortfolios();
        setNewPortfolioName('');
        setCreateDialogOpen(false);
      }
    }
  };

  const handleRenamePortfolio = async () => {
    if (portfolioToRename && newPortfolioName.trim() !== '') {
      const response = await fetch(`/api/portfolios/${portfolioToRename.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newPortfolioName.trim() }),
        }
      );
      if (response.ok) {
        fetchPortfolios();
        setPortfolioToRename(null);
        setNewPortfolioName('');
        setRenameDialogOpen(false);
      }
    }
  };

  const handleDeletePortfolio = async () => {
    if (portfolioToDelete) {
      const response = await fetch(`/api/portfolios/${portfolioToDelete.id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        await fetchPortfolios();
        setPortfolioToDelete(null);
        setDeleteDialogOpen(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle>Portfolios</CardTitle>
            <Select
              value={selectedPortfolio ? String(selectedPortfolio.id) : ""}
              onValueChange={(id) =>
                setSelectedPortfolio(portfolios.find((p) => p.id === parseInt(id)) || null)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                    {portfolio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={(isOpen) => {
              setCreateDialogOpen(isOpen);
              if (!isOpen) setNewPortfolioName('');
            }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setNewPortfolioName('')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Portfolio Name"
                value={newPortfolioName}
                onChange={(e) => setNewPortfolioName(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={handleCreatePortfolio}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <CardDescription>Manage and compare your investment portfolios.</CardDescription>
          <div className="mt-4">
            <h3 className="font-semibold">Portfolio List</h3>
            {portfolios.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {portfolios.map((portfolio) => (
                  <li
                    key={portfolio.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <span>{portfolio.name}</span>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isRenameDialogOpen && portfolioToRename?.id === portfolio.id}
                        onOpenChange={(isOpen) => {
                          setRenameDialogOpen(isOpen);
                          if (!isOpen) {
                            setPortfolioToRename(null);
                            setNewPortfolioName('');
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPortfolioToRename(portfolio);
                              setNewPortfolioName(portfolio.name);
                              setRenameDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rename Portfolio</DialogTitle>
                          </DialogHeader>
                          <Input
                            value={newPortfolioName}
                            onChange={(e) => setNewPortfolioName(e.target.value)}
                          />
                          <DialogFooter>
                            <Button onClick={handleRenamePortfolio}>Save</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Dialog
                        open={isDeleteDialogOpen && portfolioToDelete?.id === portfolio.id}
                        onOpenChange={(isOpen) => {
                          setDeleteDialogOpen(isOpen);
                          if (!isOpen) setPortfolioToDelete(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPortfolioToDelete(portfolio);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Portfolio</DialogTitle>
                          </DialogHeader>
                          <p>Are you sure you want to delete the portfolio "{portfolio.name}"?</p>
                          <DialogFooter>
                            <Button variant="destructive" onClick={handleDeletePortfolio}>
                              Delete
                            </Button>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                              Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                <p className="font-medium">No portfolios found.</p>
                <p className="text-sm">Click "Create Portfolio" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <PortfolioComparison portfolios={portfolios} />
    </div>
  );
}